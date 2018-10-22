var initProject = require('../../src/js/initProject');

casper.test.begin('Intents', 2, function suite(test) {
  
  //Reset database before each test
  initProject.reset();

  var baseHost = 'http://localhost:3000';



  casper.start(baseHost, function () {
    casper.test.comment('Starting Testing');
    //check login page
    test.assertHttpStatus(200, 'Web Server is live and running');
    test.assertTitle('Not A Game - Manager Training Simulator Login Page', 'Title is correct');
    test.assertExists('form[action="/login"]', "login form is found");
    test.assertExists('form[action="/register"]', "register button is found");
    
    //test register page
    this.fill('form[action="/register"]', {}, true); //go to register page
    test.assertTitle('Not A Game - Manager Training Simulator Registration Page', 'Title is correct');
    test.assertUrlMatch(/register/, "on register page");
    test.assertExists('form[action="/login"]', "login button is found");
    test.assertExists('form[action="/register"]', "register form is found");
    
    this.fill('form[action="/register"]', { //create new user, should redirect to index
        'username': Travis,
        'password': Password
    }, true);
    test.assertTitle('Not A Game - Manager Training Simulator', 'Title is correct');
    test.assertExists('form[action="/logout"]', "logout button found");
    this.fill('form[action="/logout"]', {}, true); //return to login page
    
    test.assertTitle('Not A Game - Manager Training Simulator Login Page', 'Title is correct');
    test.assertUrlMatch(/login/, "on register page");
    this.fill('form[action="/login"]', { //test that user can login again
        'username': Travis,
        'password': Password
    }, true);
    test.assertTitle('Not A Game - Manager Training Simulator', 'Title is correct');

  });

  casper.run(function () {
    test.done();
  });
});