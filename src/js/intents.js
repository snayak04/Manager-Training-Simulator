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
    database.getProjectState(function(result){
      returnMessage = 'test';
    });
    
    //wait for message to be built
    deasync.loopWhile(function(){return returnMessage == null});
    return returnMessage;
  },
    
  taskInfo: function (response) {
    database.getAllTasks(function(result){
      console.log(result);
    });
    return 'TASKS INTENT';
  },
    
  projectInfo: function (response) {
	var sync;
	var string = ""
	database.getProjectState(function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]))
	  string += result[0].title + ":"
	  string += "<br>Time = " + result[0].startTime
	  string += "<br>Deadline = " + result[0].deadline
	  var timeLeft = result[0].deadline - result[0].startTime
	  timeLeft /= 1000
	  var sec = timeLeft % 60
	  var min = (timeLeft / 60) % 60
	  var hours = (timeLeft / 3600) % 24
	  var days = Math.floor(timeLeft / 86400)
	  string += "<br>You have "+days+" days, "+hours+" hours, and "+min+" minutes left to complete the project."
	  
	  var string = "\nProject Title = " + result[0].title + "\nTime = " + result[0].startTime + "\nDeadline = " + result[0].deadline + "\nYou have "+days+" days, "+hours+" hours, and "+min+" minutes left to complete the project."
	  
	  sync = 1;
    });
	deasync.loopWhile(function(){return sync == null;});
	return string;
  },
    
  employeeInfo: function (response) {
	var string = "";
	var sync;
    database.getAllEmployees(function(result){
		//process.stdout.write("Keys = " + Object.keys(result[0]))
		result.forEach(function(employee){
			string += employee.name+":"
			string += "<br>Title: " + employee.jobTitle
			string += "<br>Skill: "+employee.skill
			
			var job = employee.workingOn
			if(job == null){job = "nothing"}
			string += "<br>Working on: " + job
			string += "<br>Satisfaction: "+employee.satisfaction
			
			string += "<br><br>"
		});
		sync = 1;
	});
	deasync.loopWhile(function(){return sync == null;});
	
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