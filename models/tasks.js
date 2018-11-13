const mongoose = require('mongoose');
const employees = require('./employees');

const Schema = mongoose.Schema;

const tasksSchema  = new Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    employeeIds: [{type: mongoose.Schema.Types.ObjectId, ref: 'employees'}],
    points: {type: Number, min: 1, max: 21},
    state: {type: String, enum: ['Backlog', 'Incomplete', 'Testing', 'Complete']},
    startTime: {type:Date},
    approxEndTime: Date,
    timeLeft: {type: Number, min: 0},
	hofstadtersFactor: {type: Number, min: 0}
});


const tasks = mongoose.model('tasks', tasksSchema);
module.exports = {tasks:tasks};