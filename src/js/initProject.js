//Used for accessing/modifying database and watson
const mongoose = require('mongoose');
const assistant = require('./assistant');

//config to control how project is generated
var config = require('./config');

//Database Model controllers
var taskController = require('../../controller/task');
var employeeController = require('../../controller/employee'); 
var projectController = require('../../controller/project');

//Data to pull names, tasks, etc. from
var nameData = require('../../data/names');
var jobTitleData = require('../../data/jobTitles');
var taskData = require('../../data/tasks');


/*
Randomizes employees from list of names and titles. Returns an array of ObjectIds of the employees
*/
function randomizeEmployees(user, num){
  retVal = [];
  nameList = nameData.names.slice();
  titleList = jobTitleData.jobTitles.slice();
  
  var i = 0;
  var skill;
  var satisfaction;
  var name;
  var nameIndex;
  var title;
  var titleIndex;
  while(i < num){
    //skill and satisfaciton is a random int between 1 and 100, inclusive
    skill = Math.floor(Math.random() * 100 + 1);
    satisfaction = Math.floor(Math.random() * 100 + 1);
    //name is a random name from the list of names we have. Remove after using so we don't repeat
    nameIndex = Math.floor(Math.random() * nameList.length);
    name = nameList[nameIndex];
    nameList.splice(nameIndex, 1);
    //jobTitle is a random title from title list. Can be repeated
    titleIndex = Math.floor(Math.random() * titleList.length);
    title = titleList[titleIndex];
    
    //Add to database and add new employee id into return value
    retVal.push(employeeController.insertNewEmployee(name, user._id, null, title, skill, satisfaction));
    i++;
  }
  return retVal;
};

/*
Randomize tasks based on a list. Returns an array of ObjectIds of the new tasks.
*/
function generateTasks(user, num){
  var retVal = [];
  var taskList = taskData.tasks.slice();
  var i = 0;
  
  var hoursNeeded;
  var taskName;
  var taskIndex;
  while(i < num){
    //hoursNeeded is a random int between min and max hours needed, inclusive.
    hoursNeeded = Math.floor(Math.random() * ((config.MAX_HOURS_NEEDED + 1) - config.MIN_HOURS_NEEDED) + config.MIN_HOURS_NEEDED);
    //taskName is a random name from the task list. Remove after using so no repeating
    taskIndex = Math.floor(Math.random() * taskList.length);
    taskName = taskList[taskIndex];
    taskList.splice(taskIndex, 1);
    
    //insert into database and add task Id to retval
    retVal.push(taskController.insertNewTask(taskName, user._id, 'Incomplete', [], null, null, null, hoursNeeded));
    i++;
  }
  return retVal;
}

/*
Generates a relation for each pair of employees.
*/
var generateRelations = (user, employees)=>{
	var relationArray = []
	var i = 0;
	//TODO: hackyfix for now. Relation needs to be reworked.
	employees.forEach(function(employee1name){
		employees.forEach(function(employee2name){
				var value = Math.random();
				if (employee1name == employee2name){
					value = 1;
				}
				relationArray[i] = employeeController.insertNewRelation(user._id, employee1name, employee2name, value);
				i++;
		});			
	});	
	return relationArray; //??
}

/*
Initializes the project.
*/
function generateProject (employees, relations, tasks, user){
  startDate = new Date('2018-09-24T09:00:00');
  deadline = new Date('2018-10-12T17:00:00');
  
  newProject = projectController.insertNewProject('Sprint 1', user._id, employees, relations, tasks, startDate, deadline, startDate);
  return newProject;
}

/*
Flushes the database, should probably be somewhere else be somewhere else
*/
function reset(){
  var deasync = require('deasync');
  var database = require('./DBUtils');

  var asyncDone = [false, false, false, false, false];
  //Reset all collections in database
  asyncDone[0] = database.resetCollection('employees');
  asyncDone[1] = database.resetCollection('tasks');
  asyncDone[2] = database.resetCollection('projects');
  asyncDone[3] = database.resetCollection('users');
  asyncDone[4] = database.resetCollection('relations');
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1;});
}


/*
Creates a new project for the given user. 
TODO: Deletes the user's old project, if there is one.
*/
function initialize(user){
  var employees = randomizeEmployees(user, config.NUM_EMPLOYEES);
  var tasks = generateTasks(user, config.NUM_TASKS);
  
  //Hacky fix for now. Relation should be reworked to reference employees by id, not by names.
  employeeNames = ['John', 'Harry', 'Amanda'];
  var relations = generateRelations(user, employeeNames);
  var project = generateProject(employees, relations, tasks, user);
  
}

module.exports = {
  initialize: initialize,
  reset: reset
};

