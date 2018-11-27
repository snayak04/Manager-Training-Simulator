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

function calculateActualFinishTime(user, task){
  if(task.employeeIds.length == 0){
    return -1;
  }else{
    var skillSum = 0;
	
    task.employeeIds.forEach(function(employeeId){
      //get employee from database
      var done = false;
      database.getEmployeeById(employeeId, function(employee){
        skillSum += employee.skill * employee.skill * calculateSocialFactor(user, employee, task.employeeIds);
        done = true;
      });
      deasync.loopWhile(function(){return !done;});
    });
	var skillTotal = Math.sqrt(skillSum);
	skillTotal /= 100;
    return Math.ceil(task.timeLeft / skillTotal);
  }
}

//updates a task's time left after a given number of hours based on current employees working it
//returns array of finished tasks
function updateTimeLeft(user, tasks, hours){
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
		 
		  if (employee.daysOff == 0){
			  var socialFactor = calculateSocialFactor(user, employee, task.employeeIds);
		      skillSum += employee.skill * employee.skill * socialFactor;
		      idealSkillSum += employee.skill / 100;
		  }
	  });	  
	  
	  
	  var skillTotal = Math.sqrt(skillSum);
	  skillTotal /= 100;
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


function calculateSocialFactor(user, employee, coworkerIds){
	var socialFactor = 0;
	coworkerIds.forEach(function(coworkerId){
	  var done = false;
	  database.getRelation(user, employee._id, coworkerId, function(result){
		  socialFactor += result.relationStrength;
		  done = true;
	  });
	  deasync.loopWhile(function(){return !done;});
	});
	socialFactor /= coworkerIds.length;
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

function scoreProductivity(user){
  //TODO Make this better
  var done = false;
  var employeesWorking;
  database.getAllEmployees(user, function(employees){
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

function getNextEvent(user, now){
	var nextEvent;
	var done = false;
	database.getNextEvent(now, user, function(result){
		nextEvent = result;
		done = true;
	});
	deasync.loopWhile(function(){return !done;});
	return nextEvent;
}

function getShortestFinishTime(user, tasks){
	var shortestFinishTime = null;
    tasks.forEach(function(task){
      //Don't care about complete tasks
      if(task.state != 'Complete'){
        var timeLeft = calculateActualFinishTime(user, task);
        if(!shortestFinishTime || timeLeft < shortestFinishTime){
          if(timeLeft != -1){
            shortestFinishTime = timeLeft;
          } 
        }
      }
    });
	return shortestFinishTime;
}

function getRandomMessage(employee, days, type){
	if (type == 'employee'){
		var name = employee.name;
		var more = '';
		if (employee.daysOff > 0){
			more = ' more';
		}
		messages = ["Oh, no! " + name + " has caught fire! They'll be in the hospital for " + days + more +" days.",
		name + " was injured in a very improbable foosball accident, they'll need to stay home for " + days + more +" days.",
		name + " has just came down with an illness. You think they're faking it, but they had a doctor's note, so you can't legally call them out on it. They'll be home for " + days + more +" days.",
		name + " has suddenly decided to go on a vacation. They'll be back in " + days + more +" days."]
		var message = messages[Math.floor(Math.random() * messages.length)];
		return message;
	} //else
}

function processRandomEvent(user, now){
	var coinFlip = true; //Math.random() > 0.5;
	var done = false;
	var returnMessage = '';
	if (coinFlip){
		//employee disaster
		database.getAllEmployees(user, function(employees){
			var random = Math.floor(employees.length * Math.random());
			var employee = employees[random];
			var days = Math.floor(Math.random() * 3 + 2);
			returnMessage = getRandomMessage(employee, days, "employee");
			database.updateEmployeeDaysOff(employee._id, days + employee.daysOff);
			done = true;
		});
		deasync.loopWhile(function(){return !done;});
	} //else {
		//task disaster
		//TODO I might get around to this
	
	return returnMessage; 
}

function updateDaysOff(user){
	var done = false;
	database.getAllEmployees(user, function(employees){
		employees.forEach(function(employee){
			if (employee.daysOff > 0){
				database.updateEmployeeDaysOff(employee._id, employee.daysOff - 1);
			}
		});
		done = true
	});
	deasync.loopWhile(function(){return !done;});
}

function getEventsFromOffHours(user, prevTime, currentTime){
	var done = false;
	var first = true;
	var eventMessage = '';
	var endOfLastDay = new Date(currentTime.getTime());
	endOfLastDay.setDate(currentTime.getDate() - 1);
	endOfLastDay.setHours(config.DAY_END_TIME);
	
	database.getAllEvents(user, function(events){
		events.forEach(function(evnt){
			if (endOfLastDay < evnt.date && evnt.date < currentTime){
				if (first){
					eventMessage += "<br>The following events happened while you were away:<br>";
					first = false;
				}
				eventMessage += processRandomEvent(user) + "<br>";			
			}
		});		
		done = true;
	});
	
	deasync.loopWhile(function(){return !done;});
	return eventMessage;
}

function processEndOfDay(user, tasks, currentTime, hoursLeftInDay, project, agileRating){
	var returnMessage;
	var speachText;
	
	updateTimeLeft(user, tasks, hoursLeftInDay);
	var prevTime = new Date(currentTime.getTime());
    var newTime = new Date(currentTime.getTime());
    newTime.setDate(currentTime.getDate() + 1); 
    newTime.setHours(config.DAY_START_TIME);
    database.updateProjectTime(project._id, newTime);
          
    updateTimeLeft(user, tasks, hoursLeftInDay);
    var newTime = new Date(currentTime.getTime());
    newTime.setDate(currentTime.getDate() + 1);
    newTime.setHours(config.DAY_START_TIME);
    database.updateProjectTime(project._id, newTime);
          
    if(newTime.getTime() > project.deadline.getTime()){
      //deadline has been exceeded
      returnMessage = "Sorry, you have exceeded the deadline, and have been terminated for your incompetence. You can try again by clicking the \'New Project\' button";
      speechText = null;
            
    }else{
      //Build Message
      var satisfactionRating = scoreSatisfaction();
      var productivityRating = scoreProductivity(user);
      //console.log("IN INTENTS!!" + user);
      speechText = '<speak version="1.0">It is now the end of the day <break strength="weak"></break>. Here is your rating for the day';
      speechText +=' <break strength="medium"></break> It is now ' + config.DAY_START_TIME + ' AM on ' + newTime.getMonth() + '\\' + newTime.getDate() + '</speak>';
      returnMessage = 'It is the end of the day. Here is your rating for the day:<br>'
        + '&ensp;Productivity Rating: ' + productivityRating + '<br>'
        + '&ensp;Satisfaction Rating: ' + satisfactionRating + '<br>'
        //+ '&ensp;Agile Rating: ' + agileRating.EODAnalysis(user) + '<br>'
        + '<br>'
        + 'It is now ' + config.DAY_START_TIME + ' AM on ' 
        + newTime.getMonth() + '\\' + newTime.getDate();
      //agileRating.reset();
    }
	
	updateDaysOff(user);
	returnMessage += getEventsFromOffHours(user, prevTime, newTime);
	return [returnMessage, speechText];
}

function processFinishedTask(user, tasks, currentTime, shortestFinishTime, project, agileRating){
    var finishedTasks = updateTimeLeft(user, tasks, shortestFinishTime);
    finishTasks(finishedTasks);
    currentTime.setHours(currentTime.getHours() + shortestFinishTime);
    database.updateProjectTime(project._id, currentTime);
    //database.updateProjectRating(project._id, agileRating.getScore());
    var returnMessage = '';
	var speechText = '';
	var done = false;
         
    finishedTasksIds = [];
    finishedTasks.forEach(function(finished){
        finishedTasksIds.push(finished._id);
    });
          
    //Check if project is completed
    //get tasks again as they may have been edited
    database.getAllTasks(user, function(updatedTasks){
        allTasksDone = true;
        updatedTasks.forEach(function(task){
            var index = finishedTasksIds.indexOf(task._id);
            if(task.state != "Complete" && index == -1){
                allTasksDone = false;
            }
        });
          
        if(!allTasksDone){
            //buildMessage
            speechText = '<speak version="1.0">';
            finishedTasks.forEach(function(task){
                returnMessage += 'The task \'' + task.title + '\' has been completed<br>';
                speechText += 'The task ' + task.title + ' has been completed. <break strength="weak"></break>';
            });
            var currentHour = currentTime.getHours();
            if(currentHour == 12){
                returnMessage += 'It is now 12 PM';
            }else if(currentHour > 12){
                returnMessage += 'It is now ' + (currentHour - 12)+ ' PM';
                speechText += 'It is now ' + (currentHour - 12) + ' PM </speak>';
            }else{
                returnMessage += 'It is now ' + currentHour + ' AM';
                speechText += 'It is now ' + currentHour + ' AM </speak>';
            }
        }else{
            returnMessage = "Congrats, you have completed the project! You can start a new one by clicking the \'New Project\' buttton";
            speechText = null;
        }
		done = true;
    });
	deasync.loopWhile(function(){return !done;});
	return [returnMessage, speechText];
}

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */

  wait: function (user, agileRating) {
    var returnMessage = null;
    var speechText = null;
    var done = false;
    database.getProjectState(user, function(projects){
      //Get the hours left in the day
      var project = projects[0]; //Assuming one project for now
      var currentTime = project.currentTime;
	  var nextEvent = getNextEvent(user, currentTime);
	  //round the event to the next hour
	  var hoursUntilNextEvent
	  if (nextEvent != null){
		nextEvent.setHours(nextEvent.getHours() + 1);
		nextEvent.setMinutes(0);
		nextEvent.setSeconds(0);
		nextEvent.setMilliseconds(0);
		hoursUntilNextEvent = Math.floor((nextEvent - currentTime) / (1000*3600));
	  }
	  
      var hoursLeftInDay = config.DAY_END_TIME - currentTime.getHours();
      //Check if any of the tasks will finish before the day ends
      database.getAllTasks(user, function(tasks) {
		//console.log(tasks);
        var shortestFinishTime = getShortestFinishTime(user, tasks);
		
		if ((nextEvent != null) && hoursUntilNextEvent < hoursLeftInDay && (hoursUntilNextEvent < shortestFinishTime || shortestFinishTime == null)){
			//Next event is a random event
			database.updateProjectTime(project._id, nextEvent);
			updateTimeLeft(user, tasks, hoursUntilNextEvent); 
			returnMessage = processRandomEvent(user);
			var time = nextEvent.getHours();
			var M = ' AM'
			if (time >= 12){
				M = ' PM'
			}
			if (time > 12){
				time -= 12;
			}
			
			returnMessage += '<br>It is now ' + time + M + '<br>';
			speachText = returnMessage;
			done = true;
		} else if(shortestFinishTime == null || shortestFinishTime > hoursLeftInDay){
          //Next event is end of day		  
          //Update time to next morning
		  [returnMessage, speechText] = processEndOfDay(user, tasks, currentTime, hoursLeftInDay, project, agileRating);
          done = true;          
        }else{
          //Next event is an employee finishing their task
		  [returnMessage, speechText] = processFinishedTask(user, tasks, currentTime, shortestFinishTime, project, agileRating);
          done = true;
        } 
       });
    });
    
    //wait for message to be built
    deasync.loopWhile(function(){return !done;});
    return [returnMessage, speechText];
  },
    
  taskInfo: function (user) {
    var sync = 0;
    var string = '';
    database.getAllTasks(user, function(result){
      result.forEach(function(task){
        var storyPoints = null;
        if(!task.points){
          storyPoints = 'Not assigned';
        }else{
          storyPoints = task.points;
        }
        string += '<br>' + task.title + ':';
        string += '<br>&ensp;State: ' + task.state + '<br>';
        string += '&ensp;Story Points: ' + storyPoints + '<br>';
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
              deasync.loopWhile(function(){return !done;});
            });
          }
          var eta = calculateFinishTime(task);
          if(eta == -1){eta = 'never';}
          //string += '<br>&ensp;ETA: ' + eta;
          
          string += '<br>';
        }
      });
      sync = 2;
    });
    deasync.loopWhile(function(){return sync <= 1;});
    return [string, null];
  },
    
  projectInfo: function (user) {
    var sync;
    var string = '';
    var speechText = null;
    database.getProjectState(user, function(result){
      var project = result[0];
      speechText = '<speak version="1.0">You are managing ' + project.title;
      string += project.title + ':';
      string += '<br>&ensp;Time = ' + project.currentTime;
      string += '<br>&ensp;Deadline = ' + project.deadline;
      var timeLeft = project.deadline - project.currentTime;
      timeLeft /= 1000;
      var min = (timeLeft / 60) % 60;
      var hours = (timeLeft / 3600) % 24;
      var days = Math.floor(timeLeft / 86400);
      
      string += '<br>&ensp;You have '+days+' days, '+hours+' hours, and '+min+' minutes left to complete the project.';
      speechText += ' <break strength="medium"></break> You have '+days+' days, '+hours+' hours, and '+min+' minutes left to complete the project. </speak>';
      
      sync = 1;
    });
    deasync.loopWhile(function(){return sync == null;});
    return [string, speechText];
  },
    
  employeeInfo: function (user) {
    var string = '';
    var sync;
    database.getAllEmployees(user, function(result){
      result.forEach(function(employee){
        string += employee.name+':';
        string += '<br>&ensp;Title: ' + employee.jobTitle;
      
        var job = employee.workingOn;
        if(job == null){job = 'nothing';}
        string += '<br>&ensp;Working on: ' + job;
        //string += '<br>&ensp;Skill: '+employee.skill;
        //string += '<br>&ensp;Satisfaction: '+employee.satisfaction;
		if (employee.daysOff > 0){
			string += '<br>&ensp;Days off: '+employee.daysOff;
		}
        string += '<br><br>';
      });
      sync = 1;
    });
    deasync.loopWhile(function(){return sync == null;});
	
    return [string, null];
  },
  
  /* 
	Reports information on the relationship of 2 employees
	Gives both directions. 
  */
  relationInfo: function (user, response) {
	  
	  var string = '';
    var speechText = '';
	  var employee1; //higher confidence
	  var employee2;
	  var entities = response.entities;
	  entities.forEach(function(entity){
		  if (entity.entity == 'employees'){
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
		  return ["I think you're inquiring about a relationship, but I don't know either of the employees.", null];
	  }
	  if (!employee1 && employee2){
		  return ["I think you're inquiring about a relationship involving " + employee2.value + " but I don't know what other employee.", null];
	  }
	  if (employee1 && !employee2){
		  return ["I think you're inquiring about a relationship involving " + employee1.value + " but I don't know what other employee.", null];
	  }
	  
	  
	  var name1 = employee1.value;
	  var name2 = employee2.value;
    if(name1 == name2){
      string = name1 + " has perfectly normal self-confidence";
      return[string, null];
    }
	  var sync = 0;
	  var forwards;
	  var backwards;
    var badName = false;
    database.getEmployee(user, name1, function(emp1obj){
      database.getEmployee(user, name2, function(emp2obj){
        if(emp1obj && emp2obj){
          database.getRelation(user, emp1obj._id, emp2obj._id, function(result){
            forwards = result.relationStrength;
            sync++;
            });
          database.getRelation(user, emp2obj._id, emp1obj._id, function(result){
            backwards = result.relationStrength;
            sync++;
            });
        }else{//One of the employees detected is not part of this project
            //Maybe improve this message in the future
            badName = true;
            string = "I think you're inquiring about a relationship, but I don't know either of the employees.";
            sync = 2;
        }
      });
    });
	  deasync.loopWhile(function(){return sync < 2;});
    if(badName){
      return [string, null];
    }
    
	  
    var stringPart1 = relationString(name1, name2, forwards);
    var stringPart2 = relationString(name2, name1, backwards);
    
	  string += stringPart1;
	  string += "<br>"
	  string += stringPart2;
    
    speechText += '<speak version="1.0"> ' + stringPart1;
    speechText += ' <break strength="medium"></break> ';
    speechText += stringPart2 + '</speak>';
	  
	  return [string, speechText];
  },
	
  /* Assign Task Intent
    Assigns a specified employee to the specified task
  */
  assignTask: function (user, response) {
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
        //console.log(entity);
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
      database.getTask(user, task.value, function(taskObject){
        database.getEmployee(user, employee.value, function(employeeObject){
          if(taskObject && employeeObject){
            var workers = taskObject.employeeIds;
            //check if employee is already working
            var alreadyWorking = false;
            if(workers)
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
              database.getTask(user, employeeObject.workingOn, function(oldTask){
                //remove employee from old task
                var oldTaskWorkers = oldTask.employeeIds;
                var workerIndex = oldTaskWorkers.indexOf(employeeObject._id);
                oldTaskWorkers.splice(workerIndex, 1);
                database.updateTaskWorkers(oldTask._id, oldTaskWorkers);
                //Add employee to new tasks
                workers.push(employeeObject._id);
                database.updateTaskWorkers(taskObject._id, workers);
                database.updateEmployeeWorkingOn(employeeObject._id, taskObject.title);
                //make message
                returnMessage = employeeObject.name + ' has been moved from \'' + oldTask.title + '\' to \'' + taskObject.title + '\'';
              });
            }else{
              //Add employee to task
              workers.push(employeeObject._id);
              database.updateTaskWorkers(taskObject._id, workers);
              database.updateEmployeeWorkingOn(employeeObject._id, taskObject.title);
              returnMessage = 'Assigned task \'' + taskObject.title + '\' to ' + employeeObject.name;
            }
            }else{//entered a name/task that isn't on this project
              if(!employeeObject){
                returnMessage = 'That employee does not work on this project';
              }else{
                returnMessage = 'That task is not a part of this project';
              }
            }
        });
      });
      deasync.loopWhile(function(){return returnMessage == null;});
    }
    
    return [returnMessage, null];
  },

  //Assigns story points to a given task.
  assignStoryPoints: function (user, response) {
    console.log(response);
    var returnMessage;
    var points;
    var task;
    var entities = response.entities;
   
    entities.forEach(function(entity){
      if (entity.entity == 'points')
        points = entity.value;
      else if(entity.entity == 'tasks')
          task = entity; 
    });
    
    if(!task){
      returnMessage = 'I think you\'re trying to assign ' + points + ' story points to a task, but I don\'t know for which task';
    }else{
      //get the full objects so we have all the info we need
      database.getTask(user, task.value, function(taskObject){
          if(taskObject){
            if(taskObject.state == 'Backlog' || taskObject.state === 'Incomplete'){ 
              database.updateTaskStoryPoints(taskObject._id, points);
              returnMessage = 'The task \'' + taskObject.title + '\' has been assigned ' + points + ' story points';
            }else{
              returnMessage = 'The task \'' + taskObject.title + '\' is already in progress, testing, or completed!';
            }
          }else{
            returnMessage = 'That task is not a part of this project';
          }
        });
      
      deasync.loopWhile(function(){return returnMessage == null;});
    }
    
    return [returnMessage, null];
  }
  
};