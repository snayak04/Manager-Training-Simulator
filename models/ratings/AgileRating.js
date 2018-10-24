var database = require('../../src/js/mongoosedb');
var tasks = require("../tasks");
/**
 * User starts with full points, and then gradually is marked down based on his mistakes. This will be replaced with Users model or retrieved through the database.
 * All Users will have an AgileRating object
 */


function AgileRating() {
    this.score = 0;
    
    
    /**
     * @returns this.score
     */
    AgileRating.prototype.getScore = () => {
        return this.score;
    };

    /**
     * 
     * @param {*} taskName 
     */
    AgileRating.prototype.EODAnalysis = (user) =>{
        //Check all employees were assigned tasks.
        var workerFree = false;
        database.getAllEmployees(user, function(employees){
            for (var employee in employees){
                if(!employee.workingOn)
                    workerFree = true;
            }
            if (!workerFree)
                this.score+=40;
        });
        return this.score+40;
    };
    /**
 * Always listens whenever a response is sent by Assistant API.
 * @requires Only one intent.
 * @param {JSON object that is returned by the IBM Assistant} context 
 */
AgileRating.prototype.listen = (user, context) => {
    if(!context.intents[0]){
      return 0;
    }
    var intent;
    console.log(this);
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
            scoreTask(user, task)
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