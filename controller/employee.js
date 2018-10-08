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

module.exports = {insertNewEmployee};