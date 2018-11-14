var {projects} = require('../models/projects');
var {tasks} = require('../models/tasks');
var {employees} = require('../models/employees'); 
const mongoose = require('mongoose');

//Assuming there is only 1 project at a time.
var getProjectName = projects.findOne((err, res)=>{
    if (res === null)
        return -1;
    return res;
});

//@returns the entire project JSON
var getProject = projects.findOne((err, res) =>{
    return res;
})

insertNewProject = (title, user_id, employeeIds, relationIds, taskIds, eventIds, startDate, deadline, currentTime) => {
    var newProject = new projects({
      _id: mongoose.Types.ObjectId(),
      title: title,
	  user_id: user_id,
      employees: employeeIds,
	  relations: relationIds,
      tasks: taskIds,
	  events: eventIds,
      startDate: startDate,
      deadline: deadline,
      currentTime: currentTime,
      agileRating: 0
    });
    newProject.save();
    
    return newProject;
  }




module.exports = {getProject, getProjectName, insertNewProject};