// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.


module.exports = {
	wait: function () {
		return 'WAIT INTENT'
	},
	
	taskInfo: function () {
		return 'TASKS INTENT'
	},
	
	projectInfo: function () {
		return 'PROJECT INTENT'
	},
	
	employeeInfo: function () {
		return 'EMPLOYEES INTENT'
	},
	
	singleEmployeeInfo: function () {
		return 'SINGLE EMPLOYEE INTENT'
	},
	
	assignTask: function () {
		return 'ASSIGN TASK INTENT'
	}
};