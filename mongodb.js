var MongoClient = require('mongodb').MongoClient;
var logFile = require('./log.js');
var url = "mongodb://localhost:27017/ARON-data";
var dataBase = "ARON-data";

console.log("MongoDB Server URL " + url);
//clear data base
//mongo ARON-data --eval "db.dropDatabase();

module.exports = {
    create:function(location){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dataBase);
            dbo.createCollection(location, function(err, res) {
              if (err) throw err;
              console.log("Collection created!");
              db.close();
            });
          });
    },
    insert:function(location,obj){
        MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
            if (err) throw err;
            var dbo = db.db(dataBase);
            dbo.collection(location).findOne({}, function(err, result) {
              if (err) throw err;
              if(result == null){
                dbo.createCollection(location, function(err, res) {
                  if (err) throw err;
                  logFile("Collection created",{name:location});
                });
              }
              dbo.collection(location).insertOne(obj, function(err, res) {
                if (err) throw err;
                logFile("Document inserted",obj);
                db.close(); 
              });
            });
        });          
    },
    find:function(location, callback) {
      MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dataBase);
        const collection = dbo.collection(location);
        collection.find({}).toArray(function(err, docs) {
          callback(docs);
        });
      });
    }
};