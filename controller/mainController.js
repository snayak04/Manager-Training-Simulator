var initProject = require("../src/js/initProject")
var root = 'views';

var mainController = {};

mainController.initNewProject = function(req, res){
  initProject.initialize(req.user, true);
  res.sendFile('index.html', { user : req.user, 'root': root});
};


module.exports = mainController;