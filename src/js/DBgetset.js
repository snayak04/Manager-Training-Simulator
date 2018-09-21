var DBUtil = require('./DButils.js');

var uri = "mongodb+srv://new_test_1:new_test_1@cluster0-fbxn9.mongodb.net/ksk1?retryWrites=true"

module.exports = {
  getEmployee: function(employeeName, callback){
    var search = { name: employeeName };
    DBUtil.findbyAttribute(search, "ksk1", "Employees", uri, function(result){
      return callback(result);
    });
  },
  getTask: function(taskName, callback){
    var search = { project: taskName };
    DBUtil.findbyAttribute(search, "ksk1", "Tasks", uri, function(result){
      return callback(result);
    });
  },
  getProjectState: function(projectStateName, callback){
    var search = { date: projectStateName };
    DBUtil.findbyAttribute(search, "ksk1", "ProjectStates", uri, function(result){
      return callback(result);
    });
  }
}


//findbyAttribute : function(query,dbName, collectionName, url, callback){




