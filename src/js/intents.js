// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./DBgetset');
var deasync = require('deasync');
var config = require('./config');

//returns how long a task will take to finish with current employees.
//if it will never finish, returns -1.
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

//updates a task's timeleft after a given number of hours based on current employees working it
//returns array of finished tasks
function updateTimeLeft(tasks, hours){
  //TODO Write this
  var finishedTasks = [];
  tasks.forEach(function(task){
    var skillTotal = 0;
    var done = false;
    task.employeeIds.forEach(function(employeeId){
      //get employee from database
      var done = false;
      database.getEmployeeById(employeeId, function(employee){
        skillTotal += employee.skill / 100;
        done = true;
      });
      deasync.loopWhile(function(){return !done;});
    });
    newTimeLeft = Math.floor(task.timeLeft - (hours * skillTotal));
    if(newTimeLeft <= 0){//task is finished
      newTimeLeft = 0;
      
      finishedTasks.push(task);
    }
    
    database.updateTaskTimeLeft(task._id, newTimeLeft);  
  });
  return finishedTasks;
}

function scoreProductivity(){
  //TODO Write this
  return -1;
}

function scoreSatisfaction(){
  //TODO Write this
  return -1;
}

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */
  wait: function (response) {
    var returnMessage = null;
    var done = false;
    database.getProjectState(function(projects){
      //Get the hours left in the day
      var project = projects[0]; //Assuming one project for now
      var currentTime = project.currentTime;
      var hoursLeftInDay = config.DAY_END_TIME - currentTime.getHours();
      
      //Check if any of the tasks will finish before the day ends
      database.getAllTasks(function(tasks) {
        var shortestFinishTime = null;
        tasks.forEach(function(task){
          var timeLeft = calculateFinishTime(task);
          if(!shortestFinishTime || timeLeft < shortestFinishTime){
            shortestFinishTime = timeLeft;
          }
        });
        if(shortestFinishTime == -1 || shortestFinishTime > hoursLeftInDay){
          //Next event is end of day
          updateTimeLeft(tasks, hoursLeftInDay);
          //Update time to next morning
          var newTime = new Date(currentTime.getTime());
          newTime.setDate(currentTime.getDate() + 1);
          newTime.setHours(config.DAY_START_TIME);
          database.updateProjectTime(project._id, newTime);
          //Build Message
          var satisfactionRating = scoreSatisfaction();
          var productivityRating = scoreProductivity();
          returnMessage = 'It is the end of the day. Here is your rating for the day:<br>'
            + '   Productivity Rating: ' + productivityRating + '<br>'
            + '   Satisfaction Rating: ' + satisfactionRating + '<br>'
            + '<br>'
            + 'It is now ' + config.DAY_START_TIME + ' AM on ' 
            + newTime.getMonth() + '\\' + newTime.getDate();
          done = true;
          
        }else{
          //Next event is an employee finishing their task
          var finishedTasks = [];
          finishedTasks = updateTimeLeft(task, shortestFinishTime);
          currentTime.setHours(currentTime.getHours() + shortestFinishTime);
          //buildMessage
          returnMessage = 'It is now ' + currentTime.getHours() + ' o\'clock';
          finishedTask.forEach(function(task){
            returnMessage += '<br>   The task \'' + task.title + '\' has been completed';
          });
          done = true;
        }
      });
    });
    
    //wait for message to be built
    deasync.loopWhile(function(){return !done;});
    return returnMessage;
  },
    
  taskInfo: function (response) {
    return 'TASKS INTENT';
  },
    
  projectInfo: function (response) {
    return 'PROJECT INTENT';
  },
    
  employeeInfo: function (response) {
    return 'EMPLOYEE INTENT';
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
    entities.forEach(function(entity){
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
          if (alreadyWorking){ //employee already on task
            returnMessage = employeeObject.name + ' is already working on \'' + taskObject.title + '\'';
          }else{
            //Add employee to task
            workers.push(employeeObject._id);
            database.updateTaskWorkers(taskObject._id, workers);
            returnMessage = 'Assigned task \'' + taskObject.title + '\' to ' + employeeObject.name;
          }
        });
      });
      deasync.loopWhile(function(){return returnMessage == null;});
    }
    
    return returnMessage;
  }
  
};