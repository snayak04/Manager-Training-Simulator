//This file contains functions to communicate with the watson assistant workspace.
//Things such as viewing/adding/removing entity values are here.
//Need to make sure database stays up to date with the assistant when using these.

var watson = require('watson-developer-cloud');

var assistant = new watson.AssistantV1({
  version: '2018-07-10'
});

var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
if (!workspace || workspace === '<workspace-id>') {
  console.error( 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.');
}

//Add an employee to the assistant
function addEmployee(newEmployee){
  var params = {
    workspace_id: workspace,
    entity: 'employees',
    value: newEmployee
  };
  
  assistant.createValue(params, function(err, response) {
    if (err) {
      //TODO: Figure out how to pass out the error later
    }
  });
  
}

//Remove an employee from the assistant
function removeEmployee(employee){
    var params = {
    workspace_id: workspace,
    entity: 'employees',
    value: employee
  };
  
  assistant.deleteValue(params, function(err, response) {
    if (err) {
      //TODO: Figure out how to pass out the error later
    }
  });
}

//Add a task to the assistant
function addTask(newTask){
  var params = {
    workspace_id: workspace,
    entity: 'tasks',
    value: newTask
  };
  
  assistant.createValue(params, function(err, response) {
    if (err) {
      //TODO: Figure out how to pass out the error later
    }
  });
  
}

//Remove a task from the assistant
function removeTask(task){
var params = {
    workspace_id: workspace,
    entity: 'tasks',
    value: task
  };
  
  assistant.deleteValue(params, function(err, response) {
    if (err) {
      //TODO: Figure out how to pass out the error later
    }
  });
}


module.exports = {
  addEmployee: addEmployee,
  addTask: addTask,
  removeEmployee: removeEmployee,
  removeTask: removeTask
};


