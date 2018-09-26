var MongoClient = require('mongodb').MongoClient;

var config = require('./config');
var deasync = require('deasync');

module.exports = {
  createDataBase: function(url){
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
  },
  
  createCollection: function(collectionName){
      MongoClient.connect(process.env.DATABASE_URI, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.DATABASE_NAME);
        dbo.createCollection(collectionName, function(err, res) {
          if (err) throw err;
          console.log("Collection " + collectionName + " created!");
          db.close();
        });
      });
  },
  
  resetCollection: function(collectionName){
    var done = false;
    MongoClient.connect(process.env.DATABASE_URI, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.DATABASE_NAME);
      dbo.createCollection(collectionName, function(err, res){
        dbo.collection(collectionName).deleteMany({}, function(err, delOK) {
            if(!err){
              if (delOK) console.log("Collection " + collectionName + " emptied");
            }
            done = true;
          });
        });
    });
    deasync.loopWhile(function(){return !done});
    return done;
  },
  
  insertOneRecord : function(record, collectionName, callback){
    MongoClient.connect(process.env.DATABASE_URI, function(err, client) {
      if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
      }
      console.log('Connected...');
      //var myobj = { name: "Company Inc", address: "Highway 37" };
      var collection = client.db(process.env.DATABASE_NAME).collection(collectionName);
      collection.insertOne(record, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        //db.close();
        if(callback){
          callback(res);
        }
      });
      // perform actions on the collection object
      client.close();
    });

  },

  findbyAttribute : function(query, collectionName, callback){
    MongoClient.connect(process.env.DATABASE_URI, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.DATABASE_NAME);
      //var query = { key: value };
      dbo.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
        db.close();
        return callback(result);
      });
    });
  },

  deleteOneRecord : function(query, collectionName){
    MongoClient.connect(process.env.DATABASE_URI, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.DATABASE_NAME);
      dbo.collection(collectionName).deleteOne(query, function(err, obj){
        if (err) throw err;
        db.close();
      });
    });
  },
  
  updateOneRecord: function(query, collectionName, newValues){
    MongoClient.connect(process.env.DATABASE_URI, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.DATABASE_NAME);
      dbo.collection(collectionName).updateOne(query, newValues, function(err, obj){
        if (err) throw err;
        db.close();
      });
    });
  }
  

};







