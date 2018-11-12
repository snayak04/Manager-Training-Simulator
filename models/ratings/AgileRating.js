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
        database.updateProjectRating(this.project._id, 0);
       } 
    /**
     * 
     * @param {*} taskName 
     */
    AgileRating.prototype.EODAnalysis = (user) =>{
        //Check all employees were assigned tasks.
        var score = this.project.agileRating;
        
        var sync;
        database.getAllEmployees(user, function(employees){
            
           employees.forEach(function(employee){
                if(employee.workingOn == null)
                    score+=10;
                else
                    score+=20;
            });
            sync = 1;
        });
        deasync.loopWhile(function(){return sync == null;});
        database.updateProjectRating(this.project._id, score);
        return score;
    };
    });

    //this.score = this.project.agileRating;
    
      /**
 * Always listens whenever a response is sent by Assistant API.
 * @requires Only one intent.
 * @param {JSON object that is returned by the IBM Assistant} context 
 */
AgileRating.prototype.listen = (context) => {
    if(!context.intents[0]){
      return 0;
    }
    var intent;
    if (context)
        if(context.intents[0].intent)
            intent = context.intents[0].intent;
    var entities = context.entities; //This can have multiple entities.
    var task = "";
    var employees = "";
    //console.log(entities);
    for(var i  = 0; i< entities.length; i++){
        // console.log(entities[i]);
        if (entities[i].entity === 'tasks')
            task = entities[i].value
        else  if (entities[i].entity === 'employees')
            employees = entities[i].value   
    }
   // console.log(context);
    switch(intent){
        case 'ProjectInfo':
            //TODO
        break;
        case 'EmployeeInfo':
            //TODO
        break;
        case 'AssignTask':
           // scoreTask(user, task)
        break;
    }
};
}

/**
 * Checks the task object to see if it has a story point, and assigned to an employee, if not deduct score.
 * @param {*} taskName Task name
 */
function scoreTask(user, taskName){
    var task;
    database.getTask(user, taskName, function(result){
        task = result;  
        //console.log("Task Name: " + taskName + "Task: " +task);

    });
}


module.exports = AgileRating;