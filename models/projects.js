const mongoose = require('mongoose');
const employees = require('./employees');
const tasks = require("./tasks.js");

const Schema = mongoose.Schema;


const projectsSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    employees: [{type: mongoose.Schema.Types.ObjectId, ref: 'employees'}],
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
    startDate: Date,
    deadLine: Date
});

const projects = mongoose.model('projects', projectsSchema);

module.exports = {projects:projects};