var database = require('./mongoosedb');
var deasync = require('deasync');
var config = require('./config');

module.exports = {
	employees: function () {
	    var string = '';
	    var sync;
	    database.getAllEmployees(function(result){
	      //process.stdout.write("Keys = " + Object.keys(result[0]))
	      result.forEach(function(employee){
	        string += employee.name+':';
	        string += '<br>&ensp;Title: ' + employee.jobTitle;
	      
	        var job = employee.workingOn;
	        if(job == null){job = 'nothing';}
	        string += '<br>&ensp;Working on: ' + job;
	      
	        string += '<br>&ensp;Skill: '+employee.skill;
	        string += '<br>&ensp;Satisfaction: '+employee.satisfaction;
	        string += '<br><br>';
	      });
	      sync = 1;
	    });
	    deasync.loopWhile(function(){return sync == null;});
		
	    return string;
	},

	tasks: function () {
    var sync = 0;
    var string = '';
    database.getAllTasks(function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]));
      result.forEach(function(task){
        string += '<br>' + task.title + ':';
        string += '<br>&ensp;State: ' + task.state + '<br>';
        if(task.state != 'Complete'){
          string += '&ensp;Time Left: ' + task.timeLeft + ' man-hours';
          string += '<br>&ensp;Employees: ';
          if(task.employeeIds.length == 0){
            string+='none';
          }else{
            var firstEmployee = true;
            task.employeeIds.forEach(function(id){
              var done = false;
              database.getEmployeeById(id, function(employee){
                if(firstEmployee){
                  string += employee.name;
                  firstEmployee = false;
                }else{
                  string += ', ' + employee.name;
                }
                done = true;
              });
              deasync.loopWhile(function(){!done;});
            });
          }
//          var eta = calculateFinishTime(task);
//          if(eta == -1){eta = 'never';}
//          string += '<br>&ensp;ETA: ' + eta;
          
          string += '<br>';
        }
      });
      sync = 2;
    });
    deasync.loopWhile(function(){return sync <= 1;});
    return string;
  }
};