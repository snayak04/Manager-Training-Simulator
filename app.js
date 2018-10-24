/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */



var config = require('./src/js/config'); //config values

const express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const mongoose = require('mongoose');

var infoMenu = require('./src/js/infoMenu');

mongoose.connect(String(process.env.DATABASE_URI), { useNewUrlParser: true }, 
  (err)=>{
    if (err)
      throw err;
    console.log("Database Connected Successfully");
  });

// ###TODO: Loading all models - This would go under the user later:
const intentHandlers = require('./src/js/intents');


var app = express();

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var User = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Bootstrap application settings
/*var options = {
  index: "login.html"
};*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./public')); // load UI from public folder
app.use(require('./routes'));



textToSpeech = new TextToSpeechV1({
    username: process.env.TEXT_TO_SPEECH_USERNAME || '<username>',
    password: process.env.TEXT_TO_SPEECH_PASSWORD || '<password>',
  });

//api to get  audio from the text
app.get('/api/synthesize', (req, res, next) => {
	  const transcript = textToSpeech.synthesize(req.query);
	  transcript.on('response', (response) => {
	  });
	  transcript.on('error', next);
	  transcript.pipe(res);
	});

// Create the service wrapper

var assistant = new AssistantV1({
  version: '2018-07-10'
});

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  var user = req.user
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the assistant service
  assistant.message(payload, function (err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }

    // This is a fix for now, as since Assistant version 2018-07-10,
    // output text can now be in output.generic.text
    var output = data.output;
    if (output.text.length === 0 && output.hasOwnProperty('generic')) {
      var generic = output.generic;
      
      if (Array.isArray(generic)) {
        // Loop through generic and add all text to data.output.text.
        // If there are multiple responses, this will add all of them
        // to the response.
        for(var i = 0; i < generic.length; i++) {
          if (generic[i].hasOwnProperty('text')) {
            data.output.text.push(generic[i].text);
          } else if (generic[i].hasOwnProperty('title')) {
            data.output.text.push(generic[i].title);
          }
        }
      }
    }

    return res.json(updateMessage(payload, data, user));
  });
});

app.get('/api/message', function (req, res) {
  var query;
  if(req.query.text == 'employees'){
    query = infoMenu.employees(req.user);
  } else if(req.query.text == 'tasks'){
    query = infoMenu.tasks(req.user);
  } else {
    query = infoMenu.projects(req.user);    
  }
  
  res.json(query);
});


//Rating variables 
const AgileRating = require('./models/ratings/AgileRating');
var agileRating = new AgileRating();
//-- Rating variables end



/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response, user) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } 
  
  response.output.textToSpeechFlag = "Y"; //flag to enable Text to Speech
  agileRating.listen(user, response);
  var intent;
  if (response.intents && response.intents[0]) {
    intent = response.intents[0];
  } else {
    response.output.text = 'I don\'t understand that. Could you try rephrasing?';
    return response;
  }
  //if intent confidence is too low, ask them to rephrase
  if(intent.confidence < config.MINIMUM_CONFIDENCE_VALUE){
    response.output.text = 'I don\'t understand that. Could you try rephrasing?';
    return response;
  }
  
  
  //console.log(intent.intent);
  switch(intent.intent){
  case 'Wait':
    responseText = intentHandlers.wait(user, agileRating);
    break;
  case 'TaskInfo':
    response.output.textToSpeechFlag = "N";
    responseText = intentHandlers.taskInfo(user);
    break;
  case 'ProjectInfo':
    responseText = intentHandlers.projectInfo(user);
    break;
  case 'EmployeeInfo':
    response.output.textToSpeechFlag = "N";
    responseText = intentHandlers.employeeInfo(user);
    break;
  case 'RelationInfo':
    responseText = intentHandlers.relationInfo(user, response);
    break;
  case 'AssignTask':
    responseText = intentHandlers.assignTask(user, response);
    break;
  case 'AssignStoryPoints':
    responseText = intentHandlers.assignStoryPoints(user, response);
    break;
  default:
    //Do nothing
    break;
  }

  response.output.speechText = responseText[1] 
  response.output.text = responseText[0];
  return response;
}


module.exports = app;