const mongoose = require('mongoose');
const tasks = require('./tasks.js');
const projects = require('./projects.js');


const Schema = mongoose.Schema;
/*Adds a new employee to both the database and the watson assistant
  jobTitle: the employee's position
  skill: 1-100, how good they are at their job
  satisfaction: 1-100, how much they like their job
*/
const employeesSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    projects: [{type: mongoose.Schema.Types.ObjectId, ref: 'projects'}],
    workingOn: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
    skill: {type: Number, min:1, max:100},
    satisfaction: {type: Number, min:1, max:100},
    jobTitle: String
});

const employees = mongoose.model('employees', employeesSchema);
module.exports= {employees};

