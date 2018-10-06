const mongoose = require('mongoose');
const employees = require('./employees');
var tasks = require("./tasks.js");

const Schema = mongoose.Schema;
var employee = employees.employeesSchema;
var task = tasks.tasksSchema;
var projectsSchema  = new Schema({
    _id: mongoose.Types.ObjectId,
    employees: [employee],
    tasks: [task],
});

const Projects = mongoose.model('projects', projectsSchema);

module.exports = {projectsSchema, Projects};