//Defines functions for creating new tasks

var database = require('./DBUtils');
var assistant = require('./assistant.js');

/*Assign story to a task and update both the database and the watson assistant
  projectId: the id of the project the task is for
  task: the name of the task
  time: start time
  point: story point
  state: either 'incomplete' or 'complete'
  employeeIds: array of ids of employees working the task. This is probably empty if you're making a new one.
*/
function insertPoint(projectId, point, title, timeLeft, state, storyPoints, employeeIds){
  //TODO Maybe verify values?
  var newTask = {
    projectId: projectId,
    title: title,
    timeLeft: timeLeft,
    state: state,
    storyPoints, storyPoints,
    employeeIds: employeeIds
  };
  
  
  
  //Put in database
  database.insertOneRecord(newTask, 'Tasks');
  
  //Add to assistant
  assistant.addTask(newTask.title);
}
  



module.exports = {
  insertNewTask: insertNewTask
};