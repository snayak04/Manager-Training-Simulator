const {projects} = require('../models/projects');
const mongoose = require('mongoose');
const {tasks} = require('../models/tasks');
const {employees} = require('../models/employees'); 
const {relations} = require('../models/relations');
const assistant = require('../src/js/assistant.js');

var insertNewEmployee = (name, user_id, workingOn, position, skill, satisfaction, daysOff)=>{
    employee = new employees({
      _id:mongoose.Types.ObjectId(),
      user_id: user_id,
      name: name,
      workingOn: workingOn,
      jobTitle: position,
      skill: skill,
      satisfaction: satisfaction,
	  daysOff: daysOff
    });
    employee.save();
    assistant.addEmployee(employee.name);
    return employee._id;
};

var insertNewRelation = (user_id, firstId, secondId, value)=>{
	relation = new relations({
		_id:mongoose.Types.ObjectId(),
		user_id: user_id,
		firstEmp_id: firstId,
		secondEmp_id: secondId, 
		relationStrength: value
	});
	relation.save(); //??
	return relation._id;
}
  

module.exports = {insertNewEmployee, insertNewRelation};