//Defines functions for creating new tasks

var database = require('./DBUtils');
var assistant = require('./assistant.js');

/*Adds a new task to both the database and the watson assistant
  projectId: the id of the project the task is for
  title: the name of the task
  timeLeft: number of man-hours needed to finish the task
  state: either 'incomplete' or 'complete'
  employeeIds: array of ids of employees working the task. This is probably empty if you're making a new one.
*/
function insertNewTask(projectId, title, timeLeft, state, employeeIds){
  //TODO Maybe verify values?
  var newTask = {
    projectId: projectId,
    title: title,
    timeLeft: timeLeft,
    state: state,
    employeeIds: employeeIds
  }
  
  //Put in database
  database.insertOneRecord(newTask, 'Tasks');
  
  //Add to assistant
  assistant.addTask(newTask.title);
}
  



module.exports = {
  insertNewTask: insertNewTask
};