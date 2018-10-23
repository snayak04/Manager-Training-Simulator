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
          string += '<b>' + employee.name+': </b>';
          string += '<br>' + employee.jobTitle;
        
          var job = employee.workingOn;
          if(job != null){
           string += '<br>Working on: ' + job;
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
    var sync2 = 0;
    var string = '<div class=\"taskbox\">';
    database.getProjectState(user, function(result){
      var project = result[0];
      //process.stdout.write("Keys = " + Object.keys(project))
      string += '<b>' + project.title + ': </b>';
      string += '<br>Start: ' + project.currentTime;
      string += '<br>Deadline: ' + project.deadline;
      var timeLeft = project.deadline - project.currentTime;
      timeLeft /= 1000;
      var min = (timeLeft / 60) % 60;
      var hours = (timeLeft / 3600) % 24;
      var days = Math.floor(timeLeft / 86400);
      string += '<br>Time Remaining '+days+' days, '+hours+' hours, and '+min+' minutes <br>';

      sync2 = 2;
    });
    deasync.loopWhile(function(){return sync2 <=1;});

    database.getAllTasks(user, function(result){
      //process.stdout.write("Keys = " + Object.keys(result[0]));
      result.forEach(function(task){
        string += '<div class=\"employeebox\">';
        string += '<b>' + task.title + '</b>';
        string += '<br>State: ' + task.state + '<br>';
        if(task.state != 'Complete'){
          string += 'Time Left: ' + task.timeLeft + ' man-hours';
          string += '<br>Employees: ';
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
              deasync.loopWhile(function(){return !done;});
            });
          }
          
          string += '</br>';
        }
        string += '</div>';
      });
      sync = 2;
    });
    deasync.loopWhile(function(){return sync <= 1;});
    string += "</div>"
    return string;
  },

  projects: function (user) {
    var sync;
    var string = '';
    database.getProjectState(user, function(result){
      var project = result[0];
      //process.stdout.write("Keys = " + Object.keys(project))
      string += project.title + ':';
      string += '<br>Start: ' + project.currentTime;
      string += '<br>Deadline: ' + project.deadline;
      var timeLeft = project.deadline - project.currentTime;
      timeLeft /= 1000;
      var min = (timeLeft / 60) % 60;
      var hours = (timeLeft / 3600) % 24;
      var days = Math.floor(timeLeft / 86400);
      string += '<br>Time Remaining '+days+' days, '+hours+' hours, and '+min+' minutes';
      string += "<br>Tasks: "

      project.tasks.forEach(function(id){
        console.log(id);
        var done = false;
        database.getTaskById(id, function(task){
          console.log(task.title);
          string += '<div class=\"employeebox\">';
          string += '<h4>' + task.title + '</h4>';
          string += '<br>State: ' + task.state + '<br>';

          if(task.state != 'Complete'){
            string += 'Time Left: ' + task.timeLeft + ' man-hours';
            string += '<br>Employees: ';

            if(task.employeeIds.length == 0){
              string+='none';
            }else{
              var firstEmployee = true;
/*              task.employeeIds.forEach(function(empid){
                console.log(empid);
                var donezo = false;
                database.getEmployeeById(empid, function(employee){
                  if(firstEmployee){
                    string += employee.name;
                   console.log(string);
                    firstEmployee = false;
                 }else{
                   string += ', ' + employee.name;
                  }
                  donezo = true;
                });
                deasync.loopWhile(function(){return !donezo;});
                console.log("out 1")
              });*/
            }
          
            string += '</br>';
          }

          string += '</div>';
        });
        deasync.loopWhile(function(){return !done;});
      });
    
      sync = 1;
    });
    deasync.loopWhile(function(){return sync == null;});
    console.log("out 2");
    return string;
  }

};