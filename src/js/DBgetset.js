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
  }
}


//findbyAttribute : function(query,dbName, collectionName, url, callback){




