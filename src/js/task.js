//Defines functions for creating new tasks

var database = require('./DBUtils');
var assistant = require('./assistant.js');

/*Adds a new task to both the database and the watson assistant
  project: the project the task is for
  title: the name of the task
  timeLeft: number of man-hours needed to finish the task
  state: either 'incomplete' or 'complete'
  employees: array of employee names working the task
*/
function insertNewTask(project, title, timeLeft, state, employees){
  //TODO Maybe verify values?
  var newTask = {
    project: project,
    title: title,
    timeLeft: timeLeft,
    state: state,
    employees: employees
  }
  
  //Put in database
  database.insertOneRecord(newTask, 'Tasks');
  
  //Add to assistant
  assistant.addTask(newTask.title);
}
  



module.exports = {
  insertNewTask: insertNewTask
};