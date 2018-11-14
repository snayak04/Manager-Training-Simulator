
var {projects} = require('../../models/projects');
var {tasks} = require('../../models/tasks');
var {employees} = require('../../models/employees');
var {relations} = require('../../models/relations');
var {events} = require('../../models/events');

module.exports = {
  getEmployee: function(user, employeeName, callback){
    var search = { name: employeeName, user_id: user._id };
    employees.find(search, function(err, result){
      return callback(result[0]);
    });
  },
  getEmployeeById: function(employeeId, callback){
    employees.findById(employeeId, function(err, result){
      return callback(result);
    });
  },
  getAllEmployees: function(user, callback){
    //Empty query to get every employee
    var search = {user_id: user._id};
    employees.find(search, function(err, result){
      return callback(result);
    });
  },
  deleteAllEmployees: function(user, callback){
    //Empty query to get every employee
    var search = { user_id: user._id};
    employees.deleteMany(search, function(){
      return callback();
    });
  },
  getRelation: function(user, firstId, secondId, callback){
	var search = {user_id: user._id, firstEmp_id: firstId, secondEmp_id: secondId};
	relations.find(search, function(err, result){
      return callback(result[0]);
    });
  },
  deleteAllRelations: function(user, callback){
    //Empty query to get every relation
    var search = { user_id: user._id};
    relations.deleteMany(search, function(){
      return callback();
    });
  },
  getTask: function(user, taskTitle, callback){
    var search = { title: taskTitle, user_id: user._id };
    tasks.find(search, function(err, result){
      return callback(result[0]);
    });
  },
  getTaskById: function(taskId, callback){
    tasks.findById(taskId, function(err, result){
      return callback(result);
    });
  },
  getAllTasks: function(user, callback){
    //Empty query to get every task
    var search = { user_id: user._id};
    tasks.find(search, function(err, result){
      return callback(result);
    });
  },
  deleteAllTasks: function(user, callback){
    //Empty query to get every task
    var search = { user_id: user._id};
    tasks.deleteMany(search, function(){
      return callback();
    });
  },
  //For now just assume only one project
  getProjectState: function(user, callback){
    var search = { user_id: user._id};
    projects.find(search, function(err, result){
      return callback(result);
    });
  },
  deleteAllProjects: function(user, callback){
    //Empty query to get every task
    var search = { user_id: user._id};
    projects.deleteMany(search, function(){
      return callback();
    });
  },
  getAllEvents: function(user, callback){
	  var search = {user_id: user._id};
	  events.find(search, function(err, result){
		  return callback(result);
	  });
  },
  getNextEvent: function(now, user, callback){
	  var search = {user_id: user._id};
	  events.find(search, function(err, result){
		  var currentBest;
		  var chosenDate;
		  result.forEach(function(evnt){
			  var timeLeft = evnt.date - now;
			  if (timeLeft > 0 && (timeLeft < currentBest || currentBest == null)){
				  currentBest = timeLeft;
				  chosenDate = evnt.date;
			  }
		  });
		  return callback(chosenDate);
	  });
  },
  deleteAllEvents: function(user, callback){
    //Empty query to get every event
    var search = { user_id: user._id};
    events.deleteMany(search, function(){
      return callback();
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
  updateEmployeeDaysOff: function(employeeId, daysOff){
    var daysOffInsert = { $set: {daysOff: daysOff}};
    employees.findByIdAndUpdate(employeeId, daysOffInsert, function(err){
      if(err) throw err;
    });
  },
  updateProjectTime: function(projectId, newTime){
    var stateInsert = { $set: {currentTime: newTime}};
    projects.findByIdAndUpdate(projectId, stateInsert, function(err){
      if(err) throw err;
    });
  },

  updateProjectRating: function(projectId, points){
    var query = {_id: projectId};
    projects.findOneAndUpdate(query, {$set: {agileRating: points}}, { new: true }, function(err){
      if (err) throw err;
    })
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
  },
  updateTaskStoryPoints: function(taskId, points){
    var stateInsert = { $set: {points: points}};
    tasks.findByIdAndUpdate(taskId, stateInsert, function(err){
      if(err) throw err;
    });
  }
};






