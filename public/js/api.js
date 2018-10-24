// The Api module is designed to handle all interactions with the server

var Api = (function() {
  var requestPayload;
  var responsePayload;
  var messageEndpoint = '/api/message';

  // Publicly accessible methods defined
  return {
    sendRequest: sendRequest,

    // The request/response getters/setters are defined here to prevent internal methods
    // from calling the methods without any of the callbacks that are added elsewhere.
    getRequestPayload: function() {
      return requestPayload;
    },
    setRequestPayload: function(newPayloadStr) {
      requestPayload = JSON.parse(newPayloadStr);
    },
    getResponsePayload: function() {
      return responsePayload;
    },
    setResponsePayload: function(newPayloadStr) {
      responsePayload = JSON.parse(newPayloadStr);
    }
  };

  // Send a message request to the server
  function sendRequest(text, context) {
    
    // Build request payload
    var payloadToWatson = {};
    if (text) {
      payloadToWatson.input = {
        text: text
      };
    }
    if (context) {
      payloadToWatson.context = context;
    }

    // Built http request
    var http = new XMLHttpRequest();
    http.open('POST', messageEndpoint, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function() {
      if (http.readyState === 4 && http.status === 200 && http.responseText) {
        Api.setResponsePayload(http.responseText);
        //Parsing and Sending the result obtained from server to TEXT TO SPEECH API
        var reponseJson = JSON.parse(http.responseText);
        var str = reponseJson.output.text;
  	  	console.log(reponseJson);
  	  	str = str.replace(/<br>/gi, '');  //removing html tags to avoid issues
  	  	str = str.replace(/&ensp;/gi, '');
  	  	var speak = document.getElementById('Speak');
  	  	if(speak && speak.checked == true){
  	  		if(reponseJson.output.textToSpeechFlag != 'N'){
  	  			if(reponseJson.output.speechText){
  	  				sendRequestToTextToSpeechApi(reponseJson.output.speechText);
  	  			}
  	  			else{
  	  				sendRequestToTextToSpeechApi(str);
  	  			}
  	  		}
  	  			
  	  	}
  	  		
  	  	console.log(str);
      }
    };

    var params = JSON.stringify(payloadToWatson);
    // Stored in variable (publicly visible through Api.getRequestPayload)
    // to be used throughout the application
    if (Object.getOwnPropertyNames(payloadToWatson).length !== 0) {
      Api.setRequestPayload(params);
    }

    // Send request
    http.send(params);
  }
  
  //method to send the text to TEXT TO SPEECH API, and receive the audio output
  function sendRequestToTextToSpeechApi(text, context) {
	// Build request payload
	var param = {};
	param.text = text;
	param.voice = 'en-US_AllisonVoice';
	param.accept = 'audio/mp3'

	var http = new XMLHttpRequest();
	http.open('GET', '/api/synthesize?text=' + text
			+ '&voice=en-US_AllisonVoice&accept=audio/mp3', true);
	http.responseType = 'blob';
	http.onreadystatechange = function() {
		if (http.readyState === 4 && http.status === 200) {
			console.log(http.response);
			var blob = http.response;
			var audio = document.getElementById('audio');
			var url = window.URL.createObjectURL(blob);
			audio.setAttribute('src', url);
			audio.setAttribute('type', 'audio/mp3');
		}
	};

	var params = JSON.stringify(param);
	http.send(params);
   }
}());
