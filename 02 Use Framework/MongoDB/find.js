var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/";

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  var dbo = db.db("thangdb");   
  // The first parameter of the find() method is a query object
  // The second parameter of the find() method is the projection object that describes which fields to include in the result.
  // You are not allowed to specify both 0 and 1 values in the projection object (except if one of the fields is the _id field)
  dbo.collection("customers").find({}, { projection: { _id: 0, name: 1} }).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
})