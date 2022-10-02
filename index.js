"use strict";
//first setup and dependencies:
//npm init
//npm install express
//npm install nedb
//TEST

//use the Express package via node and import it here:
const express = require("express");
//import nedb (the database package)
const Datastore = require("nedb");
//create an variable that uses express
const app = express();
//listen through the port 3000 for me to access it through the browser (localhost:3000)
// add a port so that it doesn't use one arbitrarily, callback is a message about listening
app.listen(3000, () => console.log("listening at 3000"));
//use express to host static files for the server
//the static files that will be served are in the public folder of this server
app.use(express.static("public"));
//limit the size of the json input in the server
app.use(express.json({ limit: "1mb" }));

//give the database a path to where it is
//in this case root folder in the file transactions.db
const database = new Datastore("transactions.db");
//load or create (if it was not there before)
database.loadDatabase();

// ------------------ REQUESTS ------------------

// POST
//setup a route
//I want to receive the post in api
//then setup a callback by creating a function that has request and response as params
app.post("/api", (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});

//GET
app.get("/api", (request, response) => {
  //test response
  // response.json({ test: 123 });

  // Query all the database (find({})) and sort by timestamp
  // can be limited if .limit(n) is added after sort
  database
    .find({})
    .sort({ timestamp: 1 })
    .exec(function (err, data) {
      response.json(data);
    });
});
