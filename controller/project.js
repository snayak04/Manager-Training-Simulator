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




module.exports = {getProject, getProjectName};