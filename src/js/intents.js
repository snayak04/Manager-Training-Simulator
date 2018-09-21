// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

//var assistant = require('./assistant.js');
var database = require('./DBUtils');
var deasync = require('deasync');
var uri = "mongodb+srv://new_test_1:new_test_1@cluster0-fbxn9.mongodb.net/ksk1?retryWrites=true"

module.exports = {
  wait: function (response) {
	var responseMessage = null;
	var query = {name: "Paul"};
	database.findbyAttribute(query,"ksk1", "collectionksk", uri, function(result){
		console.log(result[0].name);
		responseMessage = "TEST MESSAGE"
	});
	
	while (responseMessage == null){
		deasync.runLoopOnce();
	}
	
    return responseMessage;
  },
    
  taskInfo: function (response) {
    return 'TASKS INTENT';
  },
    
  projectInfo: function (response) {
    return 'PROJECT INTENT';
  },
    
  employeeInfo: function (response) {
	return 'EMPLOYEE INTENT';
  },
	
  singleEmployeeInfo: function (response) {
    return 'SINGLE EMPLOYEE INTENT';
  },
	
  assignTask: function (response) {
    return 'ASSIGN TASK INTENT';
  }
  
};