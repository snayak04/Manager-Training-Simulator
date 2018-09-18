# How to start or run the project:

- Make sure Node is installed.
- clone/fork the project. 
- npm install
- npm update
- Import the workspace file from training and upload it to IBM Watson Assitant.
- edit the .env.example and fill with the credentials from your IBM account.
- Time to run the server... <strong> node server.js</strong>

9/17/18 Node/mongoose setup and how to run the server

 - Make sure MongoDB is installed (found here: https://docs.mongodb.com/manual/installation/ )

 - Open a terminal and navigate to <your installation of mongodb>/Server/4.0/bin
 - Use the following command to use the database in the github repo: mongod --dbpath <your path to the project>\data
 	-Should say that database is hosted on port 27017 (default port can be changed using --port option)

 Optional: Mongo shell
 - Open another terminal and navigate to <your installation of mongodb>/Server/4.0/bin
 - Use command: mongo
 	-opens shell type help for commands or find them online

 Running the app:
 - While the mongodb server is up, run the app however you go about doing it (node server.js, npm start, etc...)
   -Shouldn't throw any errors and will create a connection with your hosted database, anything that you save to the 
   		database will be able to be found in the mongo shell also
