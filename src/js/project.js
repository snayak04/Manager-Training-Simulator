//This has functions to create new projects

var database = require('./DBUtils');

/* Insert a new project into database
  title: name of project
  startTime: start time of the project as a Date() object
  deadline: deadline of the project as a Date() object
*/

function insertNewProject(title, startTime, deadline, tasks, callback){
  //TODO Maybe verify values?
  var newProject = {
    title: title,
    currentTime: startTime,
    deadline: deadline,
    tasks: tasks
  }
  
  //Put in database
  database.insertOneRecord(newProject, 'Projects', function(res){
    return callback(res);
  });
}

module.exports = {
  insertNewProject: insertNewProject
};