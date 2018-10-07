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
  return [task.insertNewTask('Code the new level', 'backlog', null, null, null, null, null),
  task.insertNewTask('Add a battle royale mode', 'backlog', null, null, null, null, null),
  task.insertNewTask('Optimize performance', 'backlog', null, null, null, null, null),
  task.insertNewTask('Update user interface', 'backlog', null, null, null, null, null),
  task.insertNewTask('Add random map generation', 'backlog', null, null, null, null, null),
  ]
}

// Only initializes the project
var generateProject = (employees)=>{
  return new projects({
    _id: new mongoose.Types.ObjectId(),
    name: 'Sprint 2',
    employees: employees,
    tasks: null,
    startDate: new Date('2018-09-24T09:00:00'),
    endDate: new Date('2018-09-28T17:00:00')
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
  //Reset assistant entity values
  asyncDone[3] = assistant.clearEntityValues('tasks');
  asyncDone[4] = assistant.clearEntityValues('employees');
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1;});
}

function initialize(){
  reset();
  var employees = randomizeEmployees();
  var tasks = generateTasks();
  var project = generateProject(employees);
  project.save();

  return require('./intents');
}

module.exports = {
  initialize: initialize
};


