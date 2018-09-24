// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./DBgetset');
var deasync = require('deasync');
var config = require('./config');

//returns how long a task will take to finish with current employees.
//if it will never finish, returns -1.
function calculateFinishTime(task){
  if(!task.employees){
    return -1;
  }else{
    var skillTotal = 0;
    task.employees.forEach(function(employeeId){
      //get employee from database
      var employee; //TODO Get From DB
      skillTotal += employee.skill / 100;;
    })
  }
}

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */
  wait: function (response) {
    var returnMessage = null;
    database.getProjectState(function(result){
      //Get the hours left in the day
      var currentTime = result[0].currentTime;
      var hoursLeft = 17 - currentTime.getHours();
      
      //Check if any of the tasks will finish before the day ends
      database.getAllTasks(function(result) {
        console.log(result);
        shortestFinishTime = null;
        var i = 0;
        result.forEach(function(task){
          timeLeft = calculateFinishTime(task);
        });
      });
    
    return returnMessage;
    });
    
    //wait for message to be built
    deasync.loopWhile(function(){return returnMessage == null});
    return returnMessage;
  },
    
  taskInfo: function (response) {
    database.getAllEmployees(function(result){
      console.log(result);
    });
    database.getAllTasks(function(result){
      console.log(result);
    });
    database.getProjectState(function(result){
      console.log(result);
    });
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
      deasync.loopWhile(function(){return returnMessage == null});
    }
    
    return returnMessage;
  }
  
};