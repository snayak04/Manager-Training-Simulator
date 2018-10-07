const {projects} = require('../models/projects');
const {tasks} = require('../models/tasks');
const {employees} = require('../models/employees'); 
const mongoose = require('mongoose');
const assistant = require('../src/js/assistant.js');


insertNewTask = (title, state, employeeIds, points, startTime, approxEndTime, actualEndTime) => {
    var newTask = new tasks({
      _id: mongoose.Types.ObjectId(),
      title: title,
      state: state,
      employeeIds: employeeIds,
      points:points,
      startTime:startTime,
      approxEndTime:approxEndTime,
      actualEndTime:actualEndTime
    });
    newTask.save();
    assistant.addTask(newTask.title);
  }


var getTasks = tasks.find({}, function(err, docs) {
    var res = null;
    if (!err){ 
        res = JSON.parse(JSON.stringify(docs));
    } else throw err;
    return res;
});
var updateTask;
var getTaskNames = function(){
    var tasks = getTask;
    var taskList = [];
    if (!err){ 
        for (var i = 0 ; i < tasks; i++){
        taskList[i] = tasks[i].name;
        }
    }else throw err;
    return taskList;
};
module.exports = {getTasks, getTaskNames, insertNewTask};