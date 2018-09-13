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

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var intentHandlers = require('./public/js/intents')

var app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());

// Create the service wrapper

var assistant = new AssistantV1({
  version: '2018-07-10'
});

const getFileExtension = (acceptQuery) => {
  const accept = acceptQuery || '';
  switch (accept) {
    case 'audio/ogg;codecs=opus':
    case 'audio/ogg;codecs=vorbis':
      return 'ogg';
    case 'audio/wav':
      return 'wav';
    case 'audio/mpeg':
      return 'mpeg';
    case 'audio/webm':
      return 'webm';
    case 'audio/flac':
      return 'flac';
    default:
      return 'mp3';
  }
};

var textToSpeech = new TextToSpeechV1({
  username: process.env.ASSISTANT_USERNAME,
  password: process.env.ASSISTANT_PASSWORD,
  url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});
// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
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
            textToSpeech.synthesize({
              text: generic[i].text,
              accept: 'audio/wav'
            });
            data.output.text.push(generic[i].text);
          } else if (generic[i].hasOwnProperty('title')) {
            data.output.text.push(generic[i].title);
          }
        }
      }
    }

    return res.json(updateMessage(payload, data));
  });
});


/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } 
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
	
	switch(intent.intent){
		case "Wait":
			responseText = intentHandlers.wait();
			break;
		case "Tasks":
			responseText = intentHandlers.tasks();
			break;
		case "Project":
			responseText = intentHandlers.project();
			break;
		case "MyEmployees":
			responseText = intentHandlers.myEmployees();
			break;
		
		
	}

  }
  response.output.text = responseText;
  return response;
}

module.exports = app;