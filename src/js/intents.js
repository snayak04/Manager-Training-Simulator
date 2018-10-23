// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./mongoosedb');
var deasync = require('deasync');
var config = require('./config');
//const AgileRating = require('../../models/ratings/AgileRating');

//console.log(task.getTasks);
//var agileRating = new AgileRating();
//returns how long a task will take to finish with current employees.
//if it will never finish, returns -1.
//TODO Update
function calculateFinishTime(task){
  if(task.employeeIds.length == 0){
    return -1;
  }else{
    var skillTotal = 0;
    task.employeeIds.forEach(function(employeeId){
      //get employee from database
      var done = false;
      database.getEmployeeById(employeeId, function(employee){
        skillTotal += employee.skill / 100;
        done = true;
      });
      deasync.loopWhile(function(){return !done;});
    });
    return Math.ceil(task.timeLeft / skillTotal);
  }
}

//updates a task's time left after a given number of hours based on current employees working it
//returns array of finished tasks
function updateTimeLeft(tasks, hours){
  var finishedTasks = [];
  tasks.forEach(function(task){
    //Only check tasks that are incomplete
    if(task.state != 'Complete'){
      var skillSum = 0;
	  var idealSkillSum = 0;
	  var names = getNamesFromIds(task.employeeIds);
	  
	  //TODO employee.skill isn't getting the right skill. Flip name and employee
	  //I have no idea what you're talking about, past me
	  task.employeeIds.forEach(function(id){
		  var employee;
		  var done;
		  database.getEmployeeById(id, function(emp){
			  employee = emp;
			  done = true;
		  });
		  deasync.loopWhile(function(){return !done;});
		  
		  //process.stdout.write("Employee = " + employee.name + "\n");
		  //process.stdout.write(employee.name+"'s coworkers are "+names + "\n");
		  var socialFactor = calculateSocialFactor(employee.name, names);
		  //process.stdout.write("Social Factor for " + employee.name + " = " + socialFactor + "\n");
		  skillSum += employee.skill * employee.skill * socialFactor; //there might be a prettier way to square
		  idealSkillSum += employee.skill / 100;
		  //process.stdout.write("Skill Sum = " + skillSum + "\n");
	  });	  
	  
	  
	  var skillTotal = Math.sqrt(skillSum);
	  skillTotal /= 100;
	  process.stdout.write("Ideal Skill Total = " + idealSkillSum + "\n");
	  process.stdout.write("Skill Total = " + skillTotal + "\n");
      var newTimeLeft = Math.floor(task.timeLeft - (hours * skillTotal));
      if(newTimeLeft <= 0){//task is finished
        newTimeLeft = 0;
        finishedTasks.push(task);
      }
      database.updateTaskTimeLeft(task._id, newTimeLeft);
    }    
  });
  return finishedTasks;
}


function calculateSocialFactor(employeeName, coworkerNames){
	var socialFactor = 0;
	process.stdout.write("names = " + coworkerNames + "\n");
	coworkerNames.forEach(function(coworkerName){
	  var done = false;
	  database.getRelation(employeeName, coworkerName, function(result){
		  process.stdout.write("Relation Strength from " + employeeName + " to " + coworkerName + " = " + result.relationStrength + "\n");
		  socialFactor += result.relationStrength;
		  done = true;
	  });
	  deasync.loopWhile(function(){return !done;});
	});
	
	socialFactor /= coworkerNames.length;
	process.stdout.write("Average relation strength = " + socialFactor + "\n")
	return socialFactor;
	
}

function getNamesFromIds(ids){
	var names = [];
	var i = 0;
	ids.forEach(function(employeeId){
		var done = false;
		database.getEmployeeById(employeeId, function(coworker){
		  names[i] = coworker.name;
          i++;
          done = true;
        });
        deasync.loopWhile(function(){return !done;});
	});
	return names;
}

//Does all necessary database stuff when a task finishes.
function finishTasks(finishedTasks){
  finishedTasks.forEach(function (task){
    //No one is working on this task
    task.employeeIds.forEach(function(employeeId){
      database.updateEmployeeWorkingOn(employeeId, null);
    });
    database.updateTaskWorkers(task._id, []);
    //Task is now complete
    database.updateTaskState(task._id, 'Complete');
  });
}

function scoreProductivity(){
  //TODO Make this better
  var done = false;
  var employeesWorking;
  database.getAllEmployees(function(employees){
    employeesWorking = employees.length;
    employees.forEach(function(employee){
      if(!employee.workingOn){
        employeesWorking -= 1;
      }
    });
    done = true;
  });
  deasync.loopWhile(function(){return !done;});
  var score = 10 + (employeesWorking * 30);
  return score;
}

function scoreSatisfaction(){
  //TODO Write this
  return 75;
}

/*
	emps: a string of the employees names
	value: how emp1 feels about emp2
*/
function relationString(emp1, emp2, value){
	if (value < 0.2){
		return emp1 + " hates " + emp2;
	}else if (0.2 < value < 0.4){
		return emp1 + " dislikes " + emp2;
	}else if (0.4 < value < 0.6){
		return emp1 + " tolerates " + emp2;
	}else if (0.6 < value < 0.8){
		return emp1 + " likes " + emp2;
	}else{
		return emp1 + " likes " + emp2 + " very much"
	}
}

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */
  wait: function () {
    var returnMessage = null;
    var done = false;
    database.getProjectState(function(projects){
      //Get the hours left in the day
      var project = projects[0]; //Assuming one project for now
      var currentTime = project.currentTime;
      var hoursLeftInDay = config.DAY_END_TIME - currentTime.getHours();
     // console.log(projects);
      //Check if any of the tasks will finish before the day ends
      database.getAllTasks(function(tasks) {
        var shortestFinishTime = null;
        tasks.forEach(function(task){
          //Don't care about complete tasks
          if(task.state != 'Complete'){
            var timeLeft = calculateFinishTime(task);
            if(!shortestFinishTime || timeLeft < shortestFinishTime){
              if(timeLeft != -1){
                shortestFinishTime = timeLeft;
              } 
            }
          }
        });
        
        if(shortestFinishTime == null || shortestFinishTime > hoursLeftInDay){
          //Next event is end of day		  
          //Update time to next morning
          updateTimeLeft(tasks, hoursLeftInDay);
          var newTime = new Date(currentTime.getTime());
          newTime.setDate(currentTime.getDate() + 1);
          newTime.setHours(config.DAY_START_TIME);
          database.updateProjectTime(project._id, newTime);
          
          //Build Message
          var satisfactionRating = scoreSatisfaction();
          var productivityRating = scoreProductivity();
          returnMessage = 'It is the end of the day. Here is your rating for the day:<br>'
            + '&ensp;Productivity Rating: ' + productivityRating + '<br>'
            + '&ensp;Satisfaction Rating: ' + satisfactionRating + '<br>'
            + '<br>'
            + 'It is now ' + config.DAY_START_TIME + ' AM on ' 
            + newTime.getMonth() + '\\' + newTime.getDate();
          done = true;
          
        }else{
          //Next event is an employee finishing their task
          var finishedTasks = updateTimeLeft(tasks, shortestFinishTime);
          finishTasks(finishedTasks);
          currentTime.setHours(currentTime.getHours() + shortestFinishTime);
          database.updateProjectTime(project._id, currentTime);
          
          returnMessage = '';
          
          //buildMessage
          finishedTasks.forEach(function(task){
            returnMessage += 'The task \'' + task.title + '\' has been completed<br>';
          });
          var currentHour = currentTime.getHours();
          if(currentHour == 12){
            returnMessage += 'It is now 12 PM';
          }else if(currentHour > 12){
            returnMessage += 'It is now ' + (currentHour - 12)+ ' PM';
          }else{
            returnMessage += 'It is now ' + currentHour + ' AM';
          }
          done = true;
        }
      });
    });
    
    //wait for message to be built
    deasync.loopWhile(function(){return !done;});
    return returnMessage;
  },
    
  taskInfo: function () {
    var sync = 0;
    var string = '';
    database.getAllTasks(function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]));
      result.forEach(function(task){
        string += '<br>' + task.title + ':';
        string += '<br>&ensp;State: ' + task.state + '<br>';
        if(task.state != 'Complete'){
          string += '&ensp;Time Left: ' + task.timeLeft + ' man-hours';
          string += '<br>&ensp;Employees: ';
          if(task.employeeIds.length == 0){
            string+='none';
          }else{
            var firstEmployee = true;
            task.employeeIds.forEach(function(id){
              var done = false;
              database.getEmployeeById(id, function(employee){
                if(firstEmployee){
                  string += employee.name;
                  firstEmployee = false;
                }else{
                  string += ', ' + employee.name;
                }
                done = true;
              });
              deasync.loopWhile(function(){!done;});
            });
          }
          var eta = calculateFinishTime(task);
          if(eta == -1){eta = 'never';}
          string += '<br>&ensp;ETA: ' + eta;
          
          string += '<br>';
        }
      });
      sync = 2;
    });
    deasync.loopWhile(function(){return sync <= 1;});
    return string;
  },
    
  projectInfo: function () {
    var sync;
    var string = '';
    database.getProjectState(function(result){
      var project = result[0];
      //process.stdout.write("Keys = " + Object.keys(project))
      string += project.title + ':';
      string += '<br>&ensp;Time = ' + project.currentTime;
      string += '<br>&ensp;Deadline = ' + project.deadline;
      var timeLeft = project.deadline - project.currentTime;
      timeLeft /= 1000;
      var min = (timeLeft / 60) % 60;
      var hours = (timeLeft / 3600) % 24;
      var days = Math.floor(timeLeft / 86400);
      string += '<br>&ensp;You have '+days+' days, '+hours+' hours, and '+min+' minutes left to complete the project.';
      /*string += "<br>Tasks: "
    project.tasks.forEach(function(task){
      string += "<br>" + task;
    });*/
    
      sync = 1;
    });
    deasync.loopWhile(function(){return sync == null;});
    return string;
  },
    
  employeeInfo: function () {
    var string = '';
    var sync;
    database.getAllEmployees(function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]))
      result.forEach(function(employee){
        string += employee.name+':';
        string += '<br>&ensp;Title: ' + employee.jobTitle;
      
        var job = employee.workingOn;
        if(job == null){job = 'nothing';}
        string += '<br>&ensp;Working on: ' + job;
      
        string += '<br>&ensp;Skill: '+employee.skill;
        string += '<br>&ensp;Satisfaction: '+employee.satisfaction;
        string += '<br><br>';
      });
      sync = 1;
    });
    deasync.loopWhile(function(){return sync == null;});
	
    return string;
  },
  
  /* 
	Reports information on the relationship of 2 employees
	Gives both directions. 
  */
  relationInfo: function (response) {
	  
	  var string = '';
	  var employee1; //higher confidence
	  var employee2;
	  var entities = response.entities;
	  entities.forEach(function(entity){
		  if (entity.entity == 'employees'){ //is this line necessary?
			  if (!employee1){
				  employee1 = entity;
			  } else if (!employee2){
				  employee2 = entity;
			  } else if (entity.confidence > employee1.confidence){
				  employee2 = employee1;
				  employee1 = entity;
			  } else if (entity.confidence > employee2.confidence){
				  employee2 = entity;
			  }				  
		  }		  
	  });

	  if (!employee1 && !employee2){
		  return "I think you're inquiring about a relationship, but I don't know either of the employees.";
	  }
	  if (!employee1 && employee2){
		  return "I think you're inquiring about a relationship involving " + employee2.value + " but I don't know what other employee."
	  }
	  if (employee1 && !employee2){
		  return "I think you're inquiring about a relationship involving " + employee1.value + " but I don't know what other employee."
	  }
	  
	  
	  var name1 = employee1.value;
	  var name2 = employee2.value;
	  //process.stdout.write("Names: " + name1 + ", " + name2 + "\n");
	  var sync = 0;
	  var forwards;
	  var backwards;
	  database.getRelation(name1, name2, function(result){
		  forwards = result.relationStrength;
		  sync++;
      });
	  database.getRelation(name2, name1, function(result){
		  backwards = result.relationStrength;
		  sync++;
      });
	  deasync.loopWhile(function(){return sync < 2;});
	  
	  string += relationString(name1, name2, forwards);
	  string += "<br>"
	  string += relationString(name2, name1, backwards);
	  
	  return string;
  },
	
  /* Assign Task Intent
    Assigns a specified employee to the specified task
  */
  assignTask: function (response) {
    var returnMessage;
    //Get highest confidence employee and task entity.
    var employee;
    var task;
    var entities = response.entities;
   // AgileRating.analyzeAndScore(entities);
    entities.forEach(function(entity){
      //console.log(entity.entity);
      if (entity.entity == 'employees'){
        if(!employee){
          employee = entity;
        }else if(entity.confidence > employee.confidence){
          //new value has higher confidence, replace old one.
          employee = entity;
        }
      }else if(entity.entity == 'tasks'){
        if(!task){
          task = entity;
        }else if(entity.confidence > task.confidence){
          task = entity;
        }
      }
    });
	
    if(!employee){
      returnMessage = 'I think you\'re trying to assign a task, but I don\'t for which employee';
    }else if(!task){
      returnMessage = 'I think you\'re trying to assign a task to ' + employee.value + ', but I don\'t know for which task';
    }else{
      //get the full objects so we have all the info we need
      database.getTask(task.value, function(taskObject){
        database.getEmployee(employee.value, function(employeeObject){
          var workers = taskObject.employeeIds;
          //check if employee is already working
          var alreadyWorking = false;
          workers.forEach(function(employeeId){
            if(employeeId.toString() == employeeObject._id.toString()){
              alreadyWorking = true;
            }
          });
          if(taskObject.state == 'Complete'){ //task is complete
            returnMessage = 'The task \'' + taskObject.title + '\' is already complete';
          }else if (alreadyWorking){ //employee already on this task
            returnMessage = employeeObject.name + ' is already working on \'' + taskObject.title + '\'';
          }else if(employeeObject.workingOn != null){ //employee on a different task
            returnMessage = employeeObject.name + ' is already working on a different task, \'' + employeeObject.workingOn + '\'';
          }else{
            //Add employee to task
            workers.push(employeeObject._id);
            database.updateTaskWorkers(taskObject._id, workers);
            database.updateEmployeeWorkingOn(employeeObject._id, taskObject.title);
            returnMessage = 'Assigned task \'' + taskObject.title + '\' to ' + employeeObject.name;
          }
        });
      });
      deasync.loopWhile(function(){return returnMessage == null;});
    }
    
    return returnMessage;
  }
  
};