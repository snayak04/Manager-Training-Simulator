var database = require('../../src/js/mongoosedb');
var tasks = require("../tasks");
/**
 * User starts with full points, and then gradually is marked down based on his mistakes. This will be replaced with Users model or retrieved through the database.
 * All Users will have an AgileRating object
 */
function AgileRating() {
    this.score = 100;
}

/**
 * Checks the task object to see if it has a story point, and assigned to an employee, if not deduct score.
 * @param {*} taskName Task name
 */
function scoreTask(taskName){
    var task;
    database.getTask(taskName, function(result){
        task = result;  
        console.log("Task Name: " + taskName + "Task: " +task);

    });
}
/**
 * @returns this.score
 */
AgileRating.prototype.getScore = () => {
    return this.score;
};

/**
 * Always listens whenever a response is sent by Assistant API.
 * @requires Only one intent.
 * @param {JSON object that is returned by the IBM Assistant} context 
 */
AgileRating.prototype.listen = (context) => {
    var intent = context.intents[0].intent;
    var entities = context.entities; //This can have multiple entities.
    var task;
    var employee;
    //console.log(entities);
    for(var i  = 0; i< entities.length; i++){
        console.log(entities[i]);
        if (entities[i].entity === 'tasks')
            task = entities[i].value
        else  if (entities[i].entity === 'employee')
            task = entities[i].value   
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
            scoreTask(task)
        break;
    }
};

module.exports = AgileRating;