
var {projects} = require('../../models/projects');
var {tasks} = require('../../models/tasks');
var {employees} = require('../../models/employees');


module.exports = {
  getEmployee: function(employeeName, callback){
    var search = { name: employeeName };
    employees.find(search, function(err, result){
      return callback(result[0]);
    });
  },
  getEmployeeById: function(employeeId, callback){
    employees.findById(employeeId, function(err, result){
      return callback(result);
    });
  },
  getAllEmployees: function(callback){
    //Empty query to get every employee
    var search = {};
    employees.find(search, function(err, result){
      return callback(result);
    });
  },
  getTask: function(taskTitle, callback){
    var search = { title: taskTitle };
    tasks.find(search, function(err, result){
      return callback(result[0]);
    });
  },
  getTaskById: function(taskId, callback){
    tasks.findById(taskId, function(err, result){
      return callback(result);
    });
  },
  getAllTasks: function(callback){
    //Empty query to get every task
    var search = {};
    tasks.find(search, function(err, result){
      return callback(result);
    });
  },
  //For now just assume only one project
  getProjectState: function(callback){
    var search = {};
    projects.find(search, function(err, result){
      return callback(result);
    });
  },
  updateEmployeeSatisfaction: function(employeeId, newSatis){
    var satisfactionInsert = { $set: {satisfaction: newSatis}};
    employees.findByIdAndUpdate(employeeId, satisfactionInsert, function(err){
      if(err) throw err;
    });
  },
  updateEmployeeWorkingOn: function(employeeId, newTask){
    var workingOnInsert = { $set: {workingOn: newTask}};
    employees.findByIdAndUpdate(employeeId, workingOnInsert, function(err){
      if(err) throw err;
    });
  },
  updateProjectTime: function(projectId, newTime){
    var stateInsert = { $set: {currentTime: newTime}};
    projects.findByIdAndUpdate(projectId, stateInsert, function(err){
      if(err) throw err;
    });
  },
  updateTaskWorkers: function(taskId, newWorkerArray){
    var workingInsert = { $set: {employeeIds: newWorkerArray}};
    tasks.findByIdAndUpdate(taskId, workingInsert, function(err){
      if(err) throw err;
    });
  },
  updateTaskTimeLeft: function(taskId, newLeft){
    var leftInsert = { $set: {timeLeft: newLeft}};
    tasks.findByIdAndUpdate(taskId, leftInsert, function(err){
      if(err) throw err;
    });
  },
  updateTaskState: function(taskId, newState){
    var stateInsert = { $set: {state: newState}};
    tasks.findByIdAndUpdate(taskId, stateInsert, function(err){
      if(err) throw err;
    });
  }
};






