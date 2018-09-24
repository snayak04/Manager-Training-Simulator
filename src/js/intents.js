// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./DBgetset');
var deasync = require('deasync');
var config = require('./config');

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */
  wait: function (response) {
    var returnMessage = null;
    database.updateWorking("Optimize performance", ["newworkers"]);
    database.updateTimeLeft("Optimize performance", 900);
    database.updateState("Optimize performance", "NewState");
    
    database.getAllTasks(function(result){
      console.log(result);
      returnMessage = 'test';
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
    entities.forEach(function(value){
      if (value.entity == 'employees'){
        if(!employee){
          employee = value;
        }else if(value.confidence > employee.confidence){
          //new value has higher confidence, replace old one.
          employee = value;
        }
      }else if(value.entity == 'tasks'){
        if(!task){
          task = value;
        }else if(value.confidence > task.confidence){
          task = value;
        }
      }
    });
    
    if(!employee){
      returnMessage = 'I think you\'re trying to assign a task, but I don\'t for which employee';
    }else if(!task){
      returnMessage = 'I think you\'re trying to assign a task to ' + employee.value + ', but I don\'t know for which task';
    }else{
      //TODO: ASSIGN THE TASK IN THE DATABASE HERE.
      //Need the update database wrappers to finish.
      
      returnMessage = 'Assigned task \'' + task.value + '\' to ' + employee.value;
    }
    
    
    return returnMessage;
  }
  
};