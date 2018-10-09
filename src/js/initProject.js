//New Modified version under test for Mongoose compatibility:
const mongoose = require('mongoose');
const assistant = require('./assistant');
var {projects} = require('../../models/projects');
var {tasks} = require('../../models/tasks');
var employee = require('../../controller/employee'); 
/*TODO: 
This would randomize employees from a built in list and return an array with random employees
*/
var randomizeEmployees = ()=>{
  return [employee.insertNewEmployee('John', null, 'Software Engineer', 85, 80),
  employee.insertNewEmployee('Harry', null, 'Software Intern', 30, 75),
  employee.insertNewEmployee('Amanda', null, 'Software Engineer', 75, 70)]
};

//TODO:: Returns tasks - gotta make more efficient; didn;t have enough time..
var generateTasks = ()=>{
  var task = require('../../controller/task');
  return [task.insertNewTask('Code the new level', 'Backlog', [], null, null, null, 10),
  task.insertNewTask('Add a battle royale mode', 'Backlog', [], null, null, null, 15),
  task.insertNewTask('Optimize performance', 'Backlog', [], null, null, null, 10),
  task.insertNewTask('Update user interface', 'Backlog', [], null, null, null, 10),
  task.insertNewTask('Add random map generation', 'Backlog', [], null, null, null, 20),
  ]
}

var generateRelations = (employees)=>{
	var relationArray = []
	var i = 0;
	employees.forEach(function(employee1){
		employees.forEach(function(employee2){
			//process.stdout.write("Keys = " + Object.keys(employee1))
			var value = Math.random();
			process.stdout.write(employee1.name + "'s affection for " + employee2.name + " is: " + value+ "\n");
			relationArray[i] = employee.insertNewRelation(employee1, employee2, value);
			i++;
		});			
	});	
	return relationArray;
}

// Only initializes the project
var generateProject = (employees, relations, tasks)=>{
  return new projects({
    _id: new mongoose.Types.ObjectId(),
    title: 'Sprint 2',
    employees: employees,
	relations: relations,
    tasks: tasks,
    startDate: new Date('2018-09-24T09:00:00'),
    deadline: new Date('2018-09-28T17:00:00'),
    currentTime: new Date('2018-09-24T09:00:00')
  });
}

//Flushes the old stuff from database and Assistant
var reset = ()=>{
  var deasync = require('deasync');
  var database = require('./DBUtils');

  var asyncDone = [false, false, false, false, false];
  //Reset all collections in database
  asyncDone[0] = database.resetCollection('employees');
  asyncDone[1] = database.resetCollection('tasks');
  asyncDone[2] = database.resetCollection('projects');
  asyncDone[5] = database.resetCollection('relations');
  //Reset assistant entity values
  asyncDone[3] = assistant.clearEntityValues('tasks');
  asyncDone[4] = assistant.clearEntityValues('employees');
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1;});
}

function initialize(){
  reset();
  var employees = randomizeEmployees();
  var tasks = generateTasks();
  var relations = generateRelations(employees);
  var project = generateProject(employees, relations, tasks);
  project.save();
  
  return require('./intents');
}

module.exports = {
  initialize: initialize
};
/*
	//Employee Relations
	database2.getAllEmployees(function(result){
		result.forEach(function(employee1){
			result.forEach(function(employee2){
				//process.stdout.write("Keys = " + Object.keys(employee1))
				employee.insertNewRelation(employee1, employee2, Math.random());				
			});			
		});		
	});

*/