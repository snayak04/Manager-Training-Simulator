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
  
  deasync.loopWhile(function(){return asyncDone.indexOf(false) > -1;});

  //Create new project
  var startTime = new Date('2018-09-24T09:00:00');
  var deadline = new Date('2018-09-28T17:00:00');
  projectMaker.insertNewProject('DefaultProject', startTime, deadline, function(result){
    var projectId = result.ops[0]._id;
    //Create employees
    employeeMaker.insertNewEmployee(projectId, 'John', 'Software Engineer', 85, 80);
    employeeMaker.insertNewEmployee(projectId, 'Harry', 'Software Intern', 30, 75);
    employeeMaker.insertNewEmployee(projectId, 'Amanda', 'Software Engineer', 75, 70);
    
    //Create tasks
    taskMaker.insertNewTask(projectId, 'Code the new level', 20, 'Incomplete', []);
    taskMaker.insertNewTask(projectId, 'Add a battle royale mode', 40, 'Incomplete', []);
    taskMaker.insertNewTask(projectId, 'Optimize performance', 1, 'Incomplete', []);
    taskMaker.insertNewTask(projectId, 'Update UI to twenty-first century', 30, 'Incomplete', []);
    taskMaker.insertNewTask(projectId, 'Add random map generation', 10, 'Incomplete', []);
  });
}

module.exports = {
  initialize: initialize
};

