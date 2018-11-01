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
  nameList = nameData.names;
  titlesList = jobTitleData.jobTitles;
  
  var i = 0;
  var skill;
  var satisfaction;
  var name;
  var nameIndex;
  var title;
  var titleIndex;
  while(i < num){
    //skill and satisfaciton is a random int between 1 and 100
    skill = Math.floor(Math.random() * 100 + 1);
    satisfaction = Math.floor(Math.random() * 100 + 1);
    //name is a random name from the list of names we have. Remove after using so we don't repeat
    nameIndex = Math.floor(Math.random() * nameList.length);
    name = names[nameIndex];
    names.splice(nameIndex, 1);
    //jobTitle is a random title from title list. Can be repeated
    titleIndex = Math.floor(Math.random() * titlesList.length);
    title = titlesList[titleIndex];
    
    //Add to database and add new employee id into return value
    retVal.push(employeeController.insertNewEmployee(name, user._id, null, title, skill, satisfaction));
    i++;
  }
  return retVal;
};

//TODO:: Returns tasks - gotta make more efficient; didn;t have enough time..
function generateTasks(user, num){
  var retVal = [];
  var taskLists = tasks.
  var i = 0;
  
  
  while(i < num){
    
  }
  var task = require('../../controller/task');
  return [task.insertNewTask('Code the new level', user._id,'Incomplete', [], null, null, null, 10),
  taskController.insertNewTask('Add a battle royale mode', user._id, 'Incomplete', [], null, null, null, 15),
  task.insertNewTask('Optimize performance', user._id, 'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Update user interface', user._id, 'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Add random map generation', user._id, 'Incomplete', [], null, null, null, 20),
  ];
}

var generateRelations = (user, employees)=>{
	var relationArray = []
	var i = 0;
	//hackyfix for now. Relation needs to be reworked.
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

// Only initializes the project
function generateProject (employees, relations, tasks, user){
  startDate = new Date('2018-09-24T09:00:00');
  deadline = new Date('2018-10-12T17:00:00');
  
  newProject = projectController.insertNewProject('Sprint 1', user._id, employees, relations, tasks, startDate, deadline, startDate);
  return newProject;
}

//Flushes the old stuff from database and Assistant
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

function initialize(user){
  //reset();
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

