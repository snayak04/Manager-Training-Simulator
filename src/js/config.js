//This file holds constants used elsewhere in the app.

module.exports = {
  /* INTENT HANDLING */
  MINIMUM_CONFIDENCE_VALUE: .25, //if confidence below this value, will reprompt.

  /* TIME SETTINGS */
  //Workday start/end times, 24 hour clock
  DAY_START_TIME: 9,
  DAY_END_TIME: 17,

  /* DATABASE SETTINGS */
  DATABASE_NAME: 'ksk1',
  DATABASE_URI: 'mongodb+srv://new_test_1:new_test_1@cluster0-fbxn9.mongodb.net/ksk1?retryWrites=true'

};
