const mongoose = require('mongoose');
const tasks = require('./tasks.js');
const projects = require('./projects.js');


const Schema = mongoose.Schema;
/*Adds a new relationship to both the database and the watson assistant
*/
const relationsSchema  = new Schema({
    _id: Schema.Types.ObjectId, //??
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
	firstName: String, 
	secondName: String, 
	relationStrength: {type: Number, min:0, max:1}
});

const relations = mongoose.model('relations', relationsSchema);
module.exports= {relations};

