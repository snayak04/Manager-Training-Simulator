//Defines functions to manage creating new employees

var database = require('./DBUtils');
var assistant = require('./assistant.js');

/*Adds a new employee to both the database and the watson assistant
  project: the id of the project the employee is on
  name: the name of the employee
  jobTitle: the employee's position
  skill: 1-100, how good they are at their job
  satisfaction: 1-100, how much they like their job
  professionalism: 1-100, how much they're affected by teamwork modifiers (professional people can work with people they hate)
*/

function insertNewEmployee(projectId, name, jobTitle, workingOn, skill, satisfaction, professionalism){
  //TODO Maybe verify values?
  var newEmployee = {
    projectId: projectId,
    name: name,
    jobTitle: jobTitle,
    workingOn: workingOn, 
    skill: skill,
    satisfaction: satisfaction,
	professionalism: professionalism
  };
  
  //Put in database
  database.insertOneRecord(newEmployee, 'employees');
  
  //Add to assistant
  assistant.addEmployee(newEmployee.name);
}

function insertNewRelation(currentEmployee, targetEmployee, value){
  var newRelation = {
    currentEmployee: currentEmployee,
	targetEmployee: targetEmployee,
	value: value
  };
  
  //Put in database
  database.insertOneRecord(newRelation, 'Employee_Relation');
}
  



module.exports = {
  insertNewEmployee: insertNewEmployee,
  insertNewRelation: insertNewRelation
  
};