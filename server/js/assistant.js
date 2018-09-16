//This file contains functions to communicate with the watson assistant workspace.
//Things such as viewing/adding/removing entity values are here.

var watson = require('watson-developer-cloud');

var assistant = new watson.AssistantV1({
  version: '2018-07-10'
});

var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
if (!workspace || workspace === '<workspace-id>') {
  console.error( 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.');
}




//Returns array of employees that the assistant currently has
function getEmployees(){
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  
  var params = {
    workspace_id: workspace,
    entity: 'employees',
    'export': true
  };
  
  assistant.getEntity(params, function(err, response) {
    if (err) {
      console.error(err);
    } else {
      console.log(JSON.stringify(response, null, 2));
    }
  });

}

//Add an employee to the assistant
function addEmployee(newEmployee){
  return 'TEST MESSAGE';
}

//Remove an employee from the assistant
function removeEmployee(employee){
  return 'TEST MESSAGE';
}

//Returns array of tasks that the assistant currently has
function getTasks(){
  return 'TEST MESSAGE';
}

//Add a task to the assistant
function addTask(newTask){
  return 'TEST MESSAGE';
}

//Remove a task from the assistant
function removeTask(task){
  return 'TEST MESSAGE';
}

module.exports = {
  getEmployees: getEmployees,
  getTasks: getTasks,
  addEmployee: addEmployee,
  addTask: addTask,
  removeEmployee: removeEmployee,
  removeTask: removeTask
};


