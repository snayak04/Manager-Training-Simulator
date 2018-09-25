//This file holds constants used elsewhere in the app.

module.exports = {
  /* INTENT HANDLING */
  MINIMUM_CONFIDENCE_VALUE: .25, //if confidence below this value, will reprompt.

  /* TIME SETTINGS */
  //Workday start/end times, 24 hour clock
  DAY_START_TIME: 9,
  DAY_END_TIME: 17,

  /* DATABASE SETTINGS */
  DATABASE_NAME: 'ManagerSimulator',
  DATABASE_URI: 'mongodb+srv://user:user_password1@managersimulator-hnsxz.mongodb.net/ManagerSimulator?retryWrites=true'

};
