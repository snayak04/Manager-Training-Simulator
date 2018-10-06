const mongoose = require('mongoose');


const Schema = mongoose.Schema;


var employeesSchema  = new Schema({
    _id: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
    project: [projects],
    tasks: [tasks]
});

const Employees = mongoose.model('employees', emmployeesSchema);
module.exports= {employeesSchema, Employees};
