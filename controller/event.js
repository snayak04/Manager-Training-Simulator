const {projects} = require('../models/projects');
const mongoose = require('mongoose');
const {tasks} = require('../models/tasks');
const {employees} = require('../models/employees'); 
const {relations} = require('../models/relations');
const assistant = require('../src/js/assistant.js');

var insertNewEvent = (date, user_id)=>{
	console.log("Date = " + date);
    evnt = new evnt({
      user_id: user_id,
      date: date	  
    });
    evnt.save();
    return evnt;
};

module.exports = {insertNewEvent};