//This file contains functions to communicate with the watson assistant workspace.
//Things such as viewing/adding/removing entity values are here.
//Need to make sure database stays up to date with the assistant when using these.

var watson = require('watson-developer-cloud');

var assistant = new watson.AssistantV1({
  version: '2018-07-10'
});

var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
if (!workspace || workspace === '<workspace-id>') {
  //TODO: Handle this error somehow?
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
    return response;
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
    return response;
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
    return response;
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
    return response;
  });
}


module.exports = {
  addEmployee: addEmployee,
  addTask: addTask,
  removeEmployee: removeEmployee,
  removeTask: removeTask
};


