const {projects} = require('../models/projects');
const mongoose = require('mongoose');
const {tasks} = require('../models/tasks');
const {employees} = require('../models/employees'); 
const assistant = require('../src/js/assistant.js');

var insertNewEmployee = (name, workingOn, position, skill, satisfaction)=>{
    employee = new employees({
        _id:mongoose.Types.ObjectId(),
        name: name,
        workingOn: workingOn,
        jobTitle: position,
        skill: skill,
        satisfaction: satisfaction
    });
    employee.save();
    assistant.addEmployee(employee.name);
    return employee;
};

function insertNewRelation(currentEmployee, targetEmployee, value){
  var newRelation = {
    currentEmployee: currentEmployee,
	targetEmployee: targetEmployee,
	value: value
  };
  
  //Put in database
  //database.insertOneRecord(newRelation, 'Employee_Relation');
  return newRelation;
}
  

module.exports = {insertNewEmployee, insertNewRelation};