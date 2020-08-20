var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("thangdb");
  var myobj = { name: "Company Inc", address: "Highway 38" };
  dbo.collection("customers").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});