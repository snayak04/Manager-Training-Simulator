// This is where the backend handler for each intent is defined.
// These are called from app.js after the most likely intent is determined.


module.exports = {
	wait: function () {
		return 'WAIT INTENT'
	},
	
	tasks: function () {
		return 'TASKS INTENT'
	},
	
	project: function () {
		return 'PROJECT INTENT'
	},
	
	myEmployees: function () {
		return 'EMPLOYEES INTENT'
	}
};