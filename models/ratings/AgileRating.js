var database = require('../../src/js/mongoosedb');
var deasync = require('deasync');


/**
 * User starts with full points, and then gradually is marked down based on his mistakes. This will be replaced with Users model or retrieved through the database.
 * All Users will have an AgileRating object
 */


function AgileRating(user) {
    
    
    database.getProjectState(user, function(res){
        this.project = res[0];
        

       AgileRating.prototype.reset= () =>{
           var sync;
            database.updateProjectRating(this.project._id, 0);
            sync = 1;
            deasync.loopWhile(function(){return sync == null;});
       } 
    /**
     * 
     * @param {*} taskName 
     */
    AgileRating.prototype.EODAnalysis = (user) =>{
        //Check all employees were assigned tasks.
        var score = 0;
        console.log(score);
        var message = "";
        var sync;
        var totalEmp = 0;
        database.getAllEmployees(user, function(employees){
            totalEmp = employees.length;
            employees.forEach(function(employee){
                if(employee.workingOn == null){
                    score+=10;
                    message = "Your employees were sitting idle at the end of the day!";
                }
                else
                    score+=20;
            });
            sync = 1;
        });
        deasync.loopWhile(function(){return sync == null;});
        console.log("Employees: " + totalEmp + "SCORE: "+ score);

        score = (score/(totalEmp*20)*100);
        score = Math.round(score, 0);
        database.updateProjectRating(this.project._id, score);
        console.log("NEW SCORE : " +score);
        return score;
    };


    });

    

    
}

/**
 * Checks the task object to see if it has a story point, and assigned to an employee, if not deduct score.
 * @param {*} taskName Task name
 */
function scoreTask(task){
    var score = this.project.agileRating;
    var task;
    database.getTask(task._id, function(result){
        if (task.points == null){

        }
    });
}


module.exports = AgileRating;