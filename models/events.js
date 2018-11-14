const mongoose = require('mongoose');
const tasks = require('./tasks.js');
const projects = require('./projects.js');


const Schema = mongoose.Schema;

const eventsSchema  = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    date: Date
});

const events = mongoose.model('events', eventsSchema);
module.exports= {events:events};

