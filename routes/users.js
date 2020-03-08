
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

   /* DELETE to deleteEvent. */
 router.delete('/deleteEvent/:ID', function(req, res) {
  let ID = req.params.ID;
  console.log(ID);
  console.log('deleting ID: ' + ID);
   for(let i=0; i < serverEventArray.length; i++) {
     if(ID == serverEventArray[i].ID) {
     serverEventArray.splice(i,1);
     }
   }
   res.status(200).send(JSON.stringify('deleted successfully'));
});

  //  router.???('/userlist', function(req, res) {
  //  users.update({name: 'foo'}, {name: 'bar'})



  module.exports = router;

