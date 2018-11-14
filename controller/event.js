const {projects} = require('../models/projects');
const mongoose = require('mongoose');
const {tasks} = require('../models/tasks');
const {employees} = require('../models/employees'); 
const {relations} = require('../models/relations');
const {events} = require('../models/events');
const assistant = require('../src/js/assistant.js');

var insertNewEvent = (user_id, date)=>{
    var newEvent = new events({
	  _id: mongoose.Types.ObjectId(),
      user_id: user_id,
      date: date	  
    });
    newEvent.save();
    return newEvent;
};

module.exports = {insertNewEvent};