
  var express = require('express');
  var router = express.Router();

  let serverEventArray = []; // our "permanent storage" on the web server

  // define a constructor to create movie objects
  var EventObject = function (pEventName, pDate, pNotes) {
    this.EventName = pEventName;
    this.EventDate = new Date(pDate).toDateString();
    this.Notes = pNotes;
    this.ID = serverEventArray.length;

  }

  /* POST to addEvent */
  router.post('/addEvent', function(req, res) {
    console.log(req.body);
    serverEventArray.push(req.body);
    console.log(serverEventArray);
    //res.sendStatus(200);
    res.status(200).send(JSON.stringify('success'));
  });


  /* GET eventList. */
  router.get('/eventList', function(req, res) {
    res.json(serverEventArray);
  });


  //  router.???('/userlist', function(req, res) {
  //  users.update({name: 'foo'}, {name: 'bar'})



  module.exports = router;

