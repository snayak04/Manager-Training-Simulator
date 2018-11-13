// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/

var InfoPanel = (function () {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }
  };

  // Publicly accessible methods defined
  return {
    init: init,
    showdata: showdata,
    showhelp: showhelp
  };

  function init() {
    chatUpdateSetup();
    //Api.sendRequest('', null);
  }
  // Set up callbacks on payload setters in Api module
  // This causes the displayMessage function to be called when messages are sent / received
  function chatUpdateSetup() {
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function (newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function (newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr));
    };
  }

  // Handles the menu employee selection
  function showdata(menu) {
      // Retrieve the context from the previous server response
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }
      openMenu = menu;

      // Send the user message
      Api.getRequest(menu, context);
  }

  function showhelp(){
    document.getElementById("info").innerHTML = '<h2>Help</h2><div class=\"help\">'
              + '<p>Use the menu above to see employees and status of current project</p>'
              + '<p><strong>Waiting</strong>'
              + '<br>If you wish to jump to the end of a day or wait until employees finish a task, use:<br> wait</p>'
              + '<p><strong>Assigning tasks</strong>'
              + '<br>Employees can be assigned to tasks using commands such as:<br> Assign &ltemployee&gt to &lttask&gt</p>'
              + '<p><strong>Relations</strong>'
              + '<br>You can see how two employees work together using commands such as:<br> How do &ltemployee&gt and &ltemployee&gt get along?</p>'
              + '</div>';
  }

  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload) {
    if (typeof newPayload == typeof "string"){
      document.getElementById("info").innerHTML = newPayload;
    }
  }

}());