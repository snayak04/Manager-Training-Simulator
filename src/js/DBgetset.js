var DBUtil = require('./DBUtils');

module.exports = {
  getEmployee: function(employeeName, callback){
    var search = { name: employeeName };
    DBUtil.findbyAttribute(search, 'employees', function(result){
      return callback(result[0]);
    });
  },
  getEmployeeById: function(employeeId, callback){
    var search = { _id: employeeId };
    DBUtil.findbyAttribute(search, 'employees', function(result){
      return callback(result[0]);
    });
  },
  getAllEmployees: function(callback){
    //Empty query to get every employee
    var search = {};
    DBUtil.findbyAttribute(search, 'employees', function(result){
      return callback(result);
    });
  },
  getRelation: function(firstName, secondName, callback){
	var search = (firstName: firstName, secondName: secondName)  ;
	//Whoops, wrong database
  },
  getTask: function(taskTitle, callback){
    var search = { title: taskTitle };
    DBUtil.findbyAttribute(search, 'tasks', function(result){
      return callback(result[0]);
    });
  },
  getTaskById: function(taskId, callback){
    var search = { _id: taskId };
    DBUtil.findbyAttribute(search, 'tasks', function(result){
      return callback(result[0]);
    });
  },
  getAllTasks: function(callback){
    //Empty query to get every task
    var search = {};
    DBUtil.findbyAttribute(search, 'tasks', function(result){
      return callback(result);
    });
  },
  //For now just assume only one project
  getProjectState: function(callback){
    var search = {};
    DBUtil.findbyAttribute(search, 'projects', function(result){
      return callback(result);
    });
  },
  updateEmployeeSatisfaction: function(employeeId, newSatis){
    var search = { _id: employeeId };
    var satisfactionInsert = { $set: {satisfaction: newSatis}};
    DBUtil.updateOneRecord(search, 'employees', satisfactionInsert);
  },
  updateEmployeeWorkingOn: function(employeeId, newTask){
    var search = { _id: employeeId };
    var satisfactionInsert = { $set: {workingOn: newTask}};
    DBUtil.updateOneRecord(search, 'employees', satisfactionInsert);
  },
  updateProjectTime: function(projectId, newTime){
    var search = { _id: projectId };
    var stateInsert = { $set: {currentTime: newTime}};
    DBUtil.updateOneRecord(search, 'projects', stateInsert);
  },
  updateTaskWorkers: function(taskId, newWorkerArray){
    var search = { _id: taskId };
    var workingInsert = { $set: {employeeIds: newWorkerArray}};
    DBUtil.updateOneRecord(search, 'tasks', workingInsert);
  },
  updateTaskTimeLeft: function(taskId, newLeft){
    var search = { _id: taskId};
    var leftInsert = { $set: {timeLeft: newLeft}};
    DBUtil.updateOneRecord(search, 'tasks', leftInsert);
  },
  updateTaskState: function(taskId, newState){
    var search = { _id: taskId };
    var stateInsert = { $set: {state: newState}};
    DBUtil.updateOneRecord(search, 'tasks', stateInsert);
  }
};


//findbyAttribute : function(query,dbName, collectionName, url, callback){




