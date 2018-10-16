const mongoose = require('mongoose');
const employees = require('./employees');
const tasks = require("./tasks.js");

const Schema = mongoose.Schema;


const projectsSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
    employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'employees'}],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
    startDate: Date,
    deadline: Date,
    currentTime: Date
});

const projects = mongoose.model('projects', projectsSchema);

module.exports = {projects:projects};