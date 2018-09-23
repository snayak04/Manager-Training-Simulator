// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./DBUtils');
var databaseGet = require('./DBgetset');
var deasync = require('deasync');
var uri = "mongodb+srv://new_test_1:new_test_1@cluster0-fbxn9.mongodb.net/ksk1?retryWrites=true"

module.exports = {
  /*Wait Intent
  Goes to the next event, which can be one of the following:
    -The day ending
    -An employee finishing their task
  */
  wait: function (response) {
    return 'WAIT INTENT';
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