var database = require('./mongoosedb');
var deasync = require('deasync');
var config = require('./config');

module.exports = {
	employees: function (user) {
	    var string = '';
	    var sync;
	    database.getAllEmployees(user, function(result){
	      //process.stdout.write("Keys = " + Object.keys(result[0]))
	      result.forEach(function(employee){
          string += '<div class=\"employeebox\">';
	        string += employee.name+':';
	        string += '<br>' + employee.jobTitle;
	      
	        var job = employee.workingOn;
	        if(job != null){
	         string += '<br>&ensp;Working on: ' + job;
          }

          string += '</div>';
	      });
	      sync = 1;
	    });
	    deasync.loopWhile(function(){return sync == null;});
		
	    return string;
	},

	tasks: function (user) {
    var sync = 0;
    var string = '';
    database.getAllTasks(user, function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]));
      result.forEach(function(task){
        string += '<div class=\"taskbox\">';
        string += '<h4>' + task.title + '</h4>';
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
                  console.log(string);
                  firstEmployee = false;
                }else{
                  string += ', ' + employee.name;
                }
                done = true;
              });
              deasync.loopWhile(function(){return !done;});
            });
          }
//          var eta = calculateFinishTime(task);
//          if(eta == -1){eta = 'never';}
//          string += '<br>&ensp;ETA: ' + eta;
          
          string += '</br>';
        }
        string += '</div>';
      });
      sync = 2;
    });
    deasync.loopWhile(function(){return sync <= 1;});
    return string;
  }
};