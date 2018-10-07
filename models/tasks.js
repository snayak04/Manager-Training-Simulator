const mongoose = require('mongoose');
const employees = require('./employees');

const Schema = mongoose.Schema;

const tasksSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    employeeIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'employees'}],
    points: {type: Number, min: 1, max: 21},
    state: {type: String, enum: ['backlog', 'inConstruction', 'testing', 'done']},
    startTime: {type:Date},
    approxEndTime: Date,
    actualEndDate: Date
});

var initializeTasks = (name)=>{
    var employee = new employees({
        _id:mongoose.Types.ObjectId(),
        name: name,
        assignedTo: [null],
        points: null,
        status: 'backlog',
        startTime: null,
        endTime: null
    });
    employee.save();
}

const tasks = mongoose.model('tasks', tasksSchema);
module.exports = {tasks:tasks};