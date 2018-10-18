var {projects} = require('../models/projects');
var {tasks} = require('../models/tasks');
var {employees} = require('../models/employees'); 

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

insertNewProject = (title, user_id, employeeIds, taskIds, startDate, deadline, currentTime) => {
	console.log('test2');
    var newProject = new projects({
      _id: mongoose.Types.ObjectId(),
      title: title,
	  user_id: user_id,
      employees: employeeIds,
      tasks: taskIds,
      startDate: startDate,
      deadline: deadline,
      currentTime: currentTime
    });
	console.log('test3');
    newProject.save();
    
    return newProject;
  }




module.exports = {getProject, getProjectName, insertNewProject};