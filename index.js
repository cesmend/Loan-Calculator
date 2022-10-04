"use strict";
//first setup and dependencies:
//npm init
//npm install express
//npm install nedb
//TEST FROM MAINNN

const express = require("express"); //use the Express package via node and import it here:
const Datastore = require("nedb"); //import nedb (the database package)
const app = express(); //create an variable that uses express

//listen through the port 3000 for me to access it through the browser (localhost:3000)
// add a port so that it doesn't use one arbitrarily, callback is a message about listening (console log)
app.listen(3000, () => console.log("listening at 3000"));

// ********************* TODO: PASSWORD PROTECTION *********************

// ********************* HOSTING *********************
//use express to host static files for the server
app.use(express.static("public")); //the static files that will be served are in the public folder of this server
app.use(express.json({ limit: "1mb" })); //limit the size of the json input in the server

// ********************* DATABASE *********************
//give the database a path to where it is
const database = new Datastore("transactions.db"); //in this case root folder in the file transactions.db
database.loadDatabase(); //load or create (if it was not there before)

// ********************* REQUEST HANDLING *********************
// POST
//setup a route (I want to receive the post in /api)
//setup a callback by creating a function that has request and response as parameteres
app.post("/api", (request, response) => {
  const data = request.body;

  //include the timestamp when posting to the database
  const timestamp = Date.now(); //date right now
  data.timestamp = timestamp; //timestamp value will be the date now

  database.insert(data); //insert the data into the db
  response.json(data); //return the data in json format
});

//GET
app.get("/api", (request, response) => {
  //test response
  // response.json({ test: 123 });

  database
    .find({}) //query all the db
    .sort({ timestamp: 1 }) //order by timestamp
    .exec(function (err, data) {
      response.json(data); //return the data in json format
    });
});
