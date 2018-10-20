//New Modified version under test for Mongoose compatibility:
const mongoose = require('mongoose');
const assistant = require('./assistant');
var {projects} = require('../../models/projects');
var {tasks} = require('../../models/tasks');
var employee = require('../../controller/employee'); 
var project = require('../../controller/project');
/*TODO: 
This would randomize employees from a built in list and return an array with random employees
*/
var randomizeEmployees = (user)=>{
  return [employee.insertNewEmployee('John', user._id, null, 'Software Engineer', 85, 80),
  employee.insertNewEmployee('Harry', user._id, null, 'Software Intern', 30, 75),
  employee.insertNewEmployee('Amanda', user._id, null, 'Software Engineer', 75, 70)]
};

//TODO:: Returns tasks - gotta make more efficient; didn;t have enough time..
var generateTasks = (user)=>{
  var task = require('../../controller/task');
  return [task.insertNewTask('Code the new level', user._id,'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Add a battle royale mode', user._id, 'Incomplete', [], null, null, null, 15),
  task.insertNewTask('Optimize performance', user._id, 'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Update user interface', user._id, 'Incomplete', [], null, null, null, 10),
  task.insertNewTask('Add random map generation', user._id, 'Incomplete', [], null, null, null, 20),
  ]
}

// Only initializes the project
var generateProject = (employees, tasks, user)=>{
  startDate = new Date('2018-09-24T09:00:00');
  deadline = new Date('2018-09-28T17:00:00');
  
  newProject = project.insertNewProject('Sprint 1', user._id, employees, tasks, startDate, deadline, startDate);
  return newProject;
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
  //Reset assistant entity values
  asyncDone[3] = assistant.clearEntityValues('tasks');
  asyncDone[4] = assistant.clearEntityValues('employees');
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1;});
}

function initialize(user){
  //reset();
  var employees = randomizeEmployees(user);
  var tasks = generateTasks(user);
  var project = generateProject(employees, tasks, user);
}

module.exports = {
  initialize: initialize
};


