var deasync = require('deasync');
var MongoClient = require('mongodb').MongoClient;

//These are the credentials for the mongodb travis uses
var url = 'mongodb+srv://user:user_password1@managersimulator-hnsxz.mongodb.net/MSTravis?retryWrites=true';
var dbName = 'MSTravis';

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(dbName);
    dbo.dropDatabase(function(err, result){
      if (err) throw err;
      console.log("Database dropped");
      db.close();
  });
});
  

  
