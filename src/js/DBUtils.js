var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://new_test_1:new_test_1@cluster0-fbxn9.mongodb.net/ksk1?retryWrites=true"

module.exports = {
  createDataBase: function(url){
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
  },
  createCollection: function(dbName, collectionName, url){
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.createCollection(collectionName, function(err, res) {
        if (err) throw err;
        console.log("Collection"+ collectionName+ "created!");
        db.close();
        });
      });
  },
  insertOneRecord : function(record, url, dbName, collectionName){
    MongoClient.connect(url, function(err, client) {
      if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
      }
      console.log('Connected...');
      //var myobj = { name: "Company Inc", address: "Highway 37" };
      const collection = client.db(dbName).collection(collectionName);
      collection.insertOne(record, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        //db.close();
  });
   // perform actions on the collection object
   client.close();
});

  },

  findbyAttribute : function(query,dbName, collectionName, url, callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(dbName);
      //var query = { key: value };
      dbo.collection(collectionName).find(query).toArray(function(err, result) {
        if (err) throw err;
    	return callback(result);
    	db.close();
      });
    });


  }
}







