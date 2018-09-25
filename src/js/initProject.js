//This initializes the database and assistant to handle a project for use in Thursdays demo.

var database = require('./DBUtils');
var assistant = require('./assistant');
var deasync = require('deasync');
var employeeMaker = require('./employee');
var taskMaker = require('./task');
var projectMaker = require('./project');

function initialize(){
  //have to finish resetting everything before populating it
  var asyncDone = [false, false, false, false, false];
  //Reset all collections in database
  asyncDone[0] = database.resetCollection('Employees');
  asyncDone[1] = database.resetCollection('Tasks');
  asyncDone[2] = database.resetCollection('Projects');

  //Reset assistant entity values
  asyncDone[3] = assistant.clearEntityValues('tasks');
  asyncDone[4] = assistant.clearEntityValues('employees');
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1});

  //Create new project
  var startTime = new Date('2018-09-24T09:00:00')
  var deadline = new Date('2018-09-28T17:00:00')
  projectMaker.insertNewProject('DefaultProject', startTime, deadline, ['Code the new level', 20, 'Incomplete', 'Add a battle royale mode', 'Optimize performance', 'Update UI to twenty-first century', 'Add random map generation'])

  //Create employees
  employeeMaker.insertNewEmployee('DefaultProject', 'John', 'Software Engineer',null, 85, 80);
  employeeMaker.insertNewEmployee('DefaultProject', 'Harry', 'Software Intern',null, 30, 75);
  employeeMaker.insertNewEmployee('DefaultProject', 'Amanda', 'Software Engineer',null, 75, 70);

  //Create tasks
  taskMaker.insertNewTask('DefaultProject', 'Code the new level', 20, 'Incomplete', []);
  taskMaker.insertNewTask('DefaultProject', 'Add a battle royale mode', 40, 'Incomplete', []);
  taskMaker.insertNewTask('DefaultProject', 'Optimize performance', 10, 'Incomplete', []);
  taskMaker.insertNewTask('DefaultProject', 'Update UI to twenty-first century', 30, 'Incomplete', []);
  taskMaker.insertNewTask('DefaultProject', 'Add random map generation', 10, 'Incomplete', []);
  
  
}

module.exports = {
  initialize: initialize
};


