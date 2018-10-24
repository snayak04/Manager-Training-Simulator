//This file contains functions to communicate with the watson assistant workspace.
//Things such as viewing/adding/removing entity values are here.
//Need to make sure database stays up to date with the assistant when using these.

var watson = require('watson-developer-cloud');
var deasync = require('deasync');

var assistant = new watson.AssistantV1({
  version: '2018-07-10'
});

var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
if (!process.env.WORKSPACE_ID) {
  console.warn('Error: WORKSPACE_ID is null');
  process.exit(); 
  //TODO: Handle this error somehow? - this work?
}

//Add an employee to the assistant
function addEmployee(newEmployee){
  var params = {
    workspace_id: workspace,
    entity: 'employees',
    value: newEmployee
  };
  
  assistant.createValue(params, function(err, response) {
    if (!err){
		return response;
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
    if (err) throw err;
    return response;
  });
}

//Add a task to the assistant
function addTask(newTask){
  var params = {
    workspace_id: workspace,
    entity: 'tasks',
    value: newTask,
  };
  
  assistant.createValue(params, function(err, response) {
    if(!err){
		return response;
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
    if (err) throw err;
    return response;
  });
}
//Assign a story point to the assistant
function addStoryPoints(point){
  var params = {
    workspace_id: workspace,
    entity: 'points',
    value: point
  };
  
  assistant.createValue(params, function(err, response) {
    if (!err){
		return response;
	}
  });
  
}

//Remove a story point from the assistant
function removePoints(point){
  var params = {
    workspace_id: workspace,
    entity: 'points',
    value: points
  };
  
  assistant.deleteValue(params, function(err, response) {
    if (err) throw err;
    return response;
  });
}
//Resets an entity to have no values
function clearEntityValues(entityName){
  var params = {
    workspace_id: workspace,
    entity: entityName
  };
  var done = false;
  //just delete the entity and remake it.
  assistant.deleteEntity(params, function(err, delResponse){
    assistant.createEntity(params, function(err, creResponse){
      if (err) throw err;
      done = true;
      return creResponse;
    });
    return delResponse;
  });
  deasync.loopWhile(function(){return !done;});
  return done;
}


module.exports = {
  addEmployee: addEmployee,
  addTask: addTask,
  removeEmployee: removeEmployee,
  removeTask: removeTask,
  clearEntityValues: clearEntityValues
};


