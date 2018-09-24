var DBUtil = require('./DButils.js');

module.exports = {
  getEmployee: function(employeeName, callback){
    var search = { name: employeeName };
    DBUtil.findbyAttribute(search, "Employees", function(result){
      return callback(result[0]);
    });
  },
  getEmployeeById: function(employeeId, callback){
    var search = { _id: employeeId };
    DBUtil.findbyAttribute(search, "Employees", function(result){
      return callback(result[0]);
    });
  },
  getAllEmployees: function(callback){
    //Empty query to get every employee
    var search = {};
    DBUtil.findbyAttribute(search, "Employees", function(result){
      return callback(result);
    });
  },
  getTask: function(taskTitle, callback){
    var search = { title: taskTitle };
    DBUtil.findbyAttribute(search, "Tasks", function(result){
      return callback(result[0]);
    });
  },
  getTaskById: function(taskId, callback){
    var search = { _id: taskId };
    DBUtil.findbyAttribute(search, "Tasks", function(result){
      return callback(result[0]);
    });
  },
  getAllTasks: function(callback){
    //Empty query to get every task
    var search = {};
    DBUtil.findbyAttribute(search, "Tasks", function(result){
      return callback(result);
    });
  },
  //For now just assume only one project
  getProjectState: function(callback){
    var search = {};
    DBUtil.findbyAttribute(search, "Projects", function(result){
      return callback(result);
    });
  },
  updateEmployeeSatisfaction: function(employeeId, newSatis){
    var search = { _id: employeId };
    var satisfactionInsert = { $set: {satisfaction: newSatis}};
    DBUtil.updateOneRecord(search, "Employees", satisfactionInsert);
  },
  updateProjectTime: function(projectId, newTime){
    var search = { _id: projectId };
    var stateInsert = { $set: {currentTime: newTime}};
    DBUtil.updateOneRecord(search, "Projects", stateInsert);
  },
  updateTaskWorkers: function(taskId, newWorkerArray){
    var search = { _id: taskId };
    var workingInsert = { $set: {employeeIds: newWorkerArray}};
    DBUtil.updateOneRecord(search, "Tasks", workingInsert);
  },
  updateTaskTimeLeft: function(taskId, newLeft){
    var search = { _id: taskId};
    var leftInsert = { $set: {timeleft: newLeft}};
    DBUtil.updateOneRecord(search, "Tasks", leftInsert);
  },
  updateTaskState: function(taskId, newState){
    var search = { _id: taskId };
    var stateInsert = { $set: {state: newState}};
    DBUtil.updateOneRecord(search, "Tasks", stateInsert);
  }
}


//findbyAttribute : function(query,dbName, collectionName, url, callback){




