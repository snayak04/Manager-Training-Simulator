//New Modified version under test for Mongoose compatibility:
const mongoose = require('mongoose');
const assistant = require('./assistant');
var projects = require('../../models/projects').projects;
var tasks = require('../../models/tasks').tasks;
var employee = require('../../controller/employee'); 
var project = require('../../controller/project');
/*TODO: 
This would randomize employees from a built in list and return an array with random employees
*/
function randomizeEmployees(user){
  return [employee.insertNewEmployee('John', user._id, null, 'Software Engineer', 85, 80),
  employee.insertNewEmployee('Harry', user._id, null, 'Software Intern', 30, 75),
  employee.insertNewEmployee('Amanda', user._id, null, 'Software Engineer', 75, 70)]
};

//TODO:: Returns tasks - gotta make more efficient; didn;t have enough time..
function generateTasks(user){
  var task = require('../../controller/task');
  return [task.insertNewTask('Code the new level', user._id,'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Add a battle royale mode', user._id, 'Incomplete', [], null, null, null, 15),
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
				relationArray[i] = employee.insertNewRelation(user._id, employee1name, employee2name, value);
				i++;
		});			
	});	
	return relationArray; //??
}

// Only initializes the project
function generateProject (employees, relations, tasks, user){
  startDate = new Date('2018-09-24T09:00:00');
  deadline = new Date('2018-10-12T17:00:00');
  
  newProject = project.insertNewProject('Sprint 1', user._id, employees, relations, tasks, startDate, deadline, startDate);
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
  var employees = randomizeEmployees(user);
  var tasks = generateTasks(user);
  //Hacky fix for now. Relation should be reworked to reference employees by id, not by names.
  employeeNames = ['John', 'Harry', 'Amanda'];
  var relations = generateRelations(user, employeeNames);
  var project = generateProject(employees, relations, tasks, user);
  
}

module.exports = {
  initialize: initialize,
  reset: reset
};
