//Defines functions to manage creating new employees

var database = require('./DBUtils');
var assistant = require('./assistant.js');

/*Adds a new employee to both the database and the watson assistant
  project: the id of the project the employee is on
  name: the name of the employee
  jobTitle: the employee's position
  skill: 1-100, how good they are at their job
  satisfaction: 1-100, how much they like their job
*/

function insertNewEmployee(projectId, name, jobTitle, workingOn, skill, satisfaction){
  //TODO Maybe verify values?
  var newEmployee = {
    projectId: projectId,
    name: name,
    jobTitle: jobTitle,
	workingOn: workingOn, 
    skill: skill,
    satisfaction: satisfaction
  };
  
  //Put in database
  database.insertOneRecord(newEmployee, 'Employees');
  
  //Add to assistant
  assistant.addEmployee(newEmployee.name);
}
  



module.exports = {
  insertNewEmployee: insertNewEmployee
};