// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.

var assistant = require('./assistant.js');

module.exports = {
  wait: function () {
    return 'WAIT INTENT';
  },
    
  taskInfo: function () {
    return 'TASKS INTENT';
  },
    
  projectInfo: function () {
    return 'PROJECT INTENT';
  },
    
  employeeInfo: function () {
    assistant.getEmployees();
    return 'EMPLOYEE INTENT';
  },
	
  singleEmployeeInfo: function () {
    return 'SINGLE EMPLOYEE INTENT';
  },
	
  assignTask: function () {
    return 'ASSIGN TASK INTENT';
  }
  
};