var DBUtil = require('./DButils.js');

module.exports = {
  getEmployee: function(employeeName, callback){
    var search = { name: employeeName };
    DBUtil.findbyAttribute(search,"Employees", function(result){
      return callback(result);
    });
  },
  getAllEmployees: function(callback){
    //Empty query to get every employee
    var search = {};
    DBUtil.findbyAttribute(search, "Employees", function(result){
      return callback(result);
    });
  },
  getTask: function(taskName, callback){
    var search = { title: taskName };
    DBUtil.findbyAttribute(search, "Tasks", function(result){
      return callback(result);
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
  updateSatisfaction: function(employeeName, newSatis){
    var search = { name: employeeName };
    var satisfactionInsert = { $set: {satisfaction: newSatis}};
    DBUtil.updateOneRecord(search, "Employees", satisfactionInsert);
  },
  updateProjectState: function(projectTitle, newStart){
    var search = { title: projectTitle };
    var stateInsert = { $set: {startTime: newStart}};
    DBUtil.updateOneRecord(search, "Projects", stateInsert);
  },
  updateWorking: function(taskTitle, newWorkerArray){
    var search = { title: taskTitle };
    var workingInsert = { $set: {employees: newWorkerArray}};
    DBUtil.updateOneRecord(search, "Tasks", workingInsert);
  },
  updateTimeLeft: function(taskTitle, newLeft){
    var search = { title: taskTitle };
    var leftInsert = { $set: {timeleft: newLeft}};
    DBUtil.updateOneRecord(search, "Tasks", leftInsert);
  },
  updateState: function(taskTitle, newState){
    var search = { title: taskTitle };
    var stateInsert = { $set: {state: newState}};
    DBUtil.updateOneRecord(search, "Tasks", stateInsert);
  }
}


//findbyAttribute : function(query,dbName, collectionName, url, callback){




