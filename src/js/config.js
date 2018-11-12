//This file holds constants used elsewhere in the app.

module.exports = {
  /* INTENT HANDLING */
  MINIMUM_CONFIDENCE_VALUE: .25, //if confidence below this value, will reprompt.

  /* TIME SETTINGS */
  //Workday start/end times, 24 hour clock
  DAY_START_TIME: 9,
  DAY_END_TIME: 17,
  
  /* Settings for generating new projects */
  NUM_EMPLOYEES: 4,
  NUM_TASKS: 6,
  MIN_HOURS_NEEDED: 1,
  MAX_HOURS_NEEDED: 20,
  //Number of days of leeway given when generating deadline.
  MIN_LEEWAY: 1,
  MAX_LEEWAY: 5

};
