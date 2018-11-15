const mongoose = require('mongoose');
const employees = require('./employees');
const tasks = require("./tasks");

const Schema = mongoose.Schema;


const projectsSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'employees'}],
	relations: [{type: mongoose.Schema.Types.ObjectId, ref: 'relations'}],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
    startDate: Date,
    deadline: Date,
    currentTime: Date,
    agileRating: {type: Number},
    projectDone: Boolean

});

const projects = mongoose.model('projects', projectsSchema);

module.exports = {projects};