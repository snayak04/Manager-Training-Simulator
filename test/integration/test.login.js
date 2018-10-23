casper.test.begin('Login Tests', 2, function suite(test) {
  var baseHost = 'http://localhost:3000';
  

  casper.start(baseHost, function () {
    casper.test.comment('Starting Testing');
    //check login page
    test.assertHttpStatus(200, 'Web Server is live and running');
    test.assertTitle('Not A Game - Manager Training Simulator Login Page', 'Title is correct');
    test.assertExists("form[action='/login']", 'login form is found');
    test.assertExists("form[action='/register']", 'register button is found');
    this.fill("form[action='/register']", {}, true); //go to register page
  });
    

    //test register page
    casper.then(function() {
      casper.test.comment('Testing Registration');
      test.assertTitle('Not A Game - Manager Training Simulator Registration Page', 'Title is correct');
      test.assertUrlMatch(/register/, 'on register page');
      test.assertExists("form[action='/login']", 'login button is found');
      test.assertExists("form[action='/register']", 'register form is found');
      this.fill("form[action='/register']", { //create new user, should redirect to index
        'username': Travis,
        'password': Password
      }, true);
    });
    
    //test logout
    casper.then(function(){
      casper.test.comment('Testing Logout');
      test.assertTitle('Not A Game - Manager Training Simulator', 'Title is correct');
      test.assertExists("form[action='/logout']", 'logout button found');
      this.fill("form[action='/logout']", {}, true); //return to login page
    });
    
    //test login
    casper.then(function(){
      casper.test.comment('Testing Login');
      test.assertTitle('Not A Game - Manager Training Simulator Login Page', 'Title is correct');
      test.assertUrlMatch(/login/, 'on register page');
      this.fill("form[action='/login']", { //test that user can login again
          'username': Travis,
          'password': Password
      }, true);
    });
    
    //check login worked
    casper.then(function(){
      test.assertTitle('Not A Game - Manager Training Simulator', 'Title is correct');
    });

  casper.run(function () {
    test.done();
  });
});