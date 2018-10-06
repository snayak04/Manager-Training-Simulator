const mongoose = require('mongoose');
const employees = require('./employees');

const Schema = mongoose.Schema;
var employee = employees.employeesSchema;

var tasksSchema  = new Schema({
    _id: mongoose.Types.ObjectId,
    name: String,
    assignedTo: [employee],
    points: {type: Number, min: 1, max: 21} 
});

const Tasks = mongoose.model('tasks', tasksSchema);
module.exports = {tasksSchema, Tasks};

