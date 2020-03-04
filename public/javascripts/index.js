    let userArray = [];


    // define a constructor to create event objects
    var EventObject = function (pEventName, pDate, pNotes) {
      this.EventName = pEventName;
      this.EventDate = new Date(pDate).toDateString();
      this.Notes = pNotes;
      this.ID = userArray.length;

    }


    // code in this block waits untill everything had come down from server, then it runs
    document.addEventListener("DOMContentLoaded", function () {

      document.getElementById("AddEvent").addEventListener("click", function () {
        let newEvent = new EventObject(document.getElementById("EventName").value, document.getElementById("Date").value, document.getElementById("Notes").value);
        addNewEvent(newEvent); // now post new movie object to node server
        });

      $(document).on("pagebeforeshow", "#page2", function (event) {   // have to use jQuery 
        FillArrayFromServer();  // need to get fresh data
      });

      document.getElementById("sortDate").addEventListener("click", function () {
        userArray = userArray.sort(compareDate);
        createList();
      });

      $(document).on("pagebeforeshow", "#page1", function (event) {   // have to use jQuery 
        document.getElementById("EventName").value = "";
        document.getElementById("Date").value = "";
        document.getElementById("Notes").value = "";
        });


      $(document).on("pagebeforeshow", "#page3", function (event) {   // have to use jQuery
        let localID = document.getElementById("DateparmHere").innerHTML;
          for(let i=0; i < userArray.length; i++) {   
              if(userArray[i].ID = localID){
                  document.getElementById("oneEvent").innerHTML =  userArray[localID].EventName;
                  document.getElementById("oneDate").innerHTML =  userArray[localID].EventDate;
                  document.getElementById("oneNotes").innerHTML =  userArray[localID].Notes;
                  countdown(userArray[localID].EventDate);
              }  
          }
      });

    });

    function createList() {
      // clear prior data
      var divUserlist = document.getElementById("divEventlist");
      while (divUserlist.firstChild) {    // remove any old data so don't get duplicates
        divUserlist.removeChild(divUserlist.firstChild);
      };

      var ul = document.createElement('ul');
      userArray.forEach(function (element, ) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = "<a data-transition='pop' class='onePlayer' data-parm=" + element.ID + "  href='#page3'>View Event Info </a> " + element.EventName;
        ul.appendChild(li);
      });
      divUserlist.appendChild(ul)

      // set up an event for each new li item, if user clicks any, it writes >>that<< items data-parm into the hidden html 
      var classname = document.getElementsByClassName("onePlayer");
      Array.from(classname).forEach(function (element) {
        element.addEventListener('click', function () {
          var parm = this.getAttribute("data-parm");  // passing in the eventobject.Id
          //do something here with parameter on page 3
          document.getElementById("DateparmHere").innerHTML = parm;
          document.location.href = "index.html#page3";
        });
      });

      if (userArray.length > 0) {
        document.getElementById("fillEvents").style.visibility = "hidden";
      }
    };


    // code to exchange data with node server

    function FillArrayFromServer(){
        // using fetch call to communicate with node server to get all data
        fetch('/users/eventList')
        .then(function (theResonsePromise) {  // wait for reply.  Note this one uses a normal function, not an => function
            return theResonsePromise.json();
        })
        .then(function (serverData) { // now wait for the 2nd promise, which is when data has finished being returned to client
        console.log(serverData);
        userArray.length = 0;  // clear array
        userArray = serverData;   // use our server json data which matches our objects in the array perfectly
        console.log(userArray)
        createList();  // placing this here will make it wait for data from server to be complete before re-doing the list
        })
        .catch(function (err) {
        console.log(err);
        });
    };


    // using fetch to push an object up to server
    function addNewEvent(newEvent){
      
        // the required post body data is our event object passed in, newEvent
        
        // create request object
        const request = new Request('/users/addEvent', {
            method: 'POST',
            body: JSON.stringify(newEvent),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        
        // pass that request object we just created into the fetch()
        fetch(request)
            // wait for frist server promise response of "200" success (can name these returned promise objects anything you like)
            // Note this one uses an => function, not a normal function, just to show you can do either 
            .then(theResonsePromise => theResonsePromise.json())    // the .json sets up 2nd promise
            // wait for the .json promise, which is when the data is back
            .then(theResonsePromiseJson => console.log(theResonsePromiseJson), document.location.href = "#page2" )
            // that client console log will write out the message I added to the Repsonse on the server
            .catch(function (err) {
                console.log(err);
            });
        
    }; // end of addNewUser
        
    function countdown(eventDate) {
      // Set the date we're counting down to
      countDownDate = new Date(eventDate).getTime();

      // Update the count down every 1 second
      var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="countdown"
        document.getElementById("countdown").innerHTML = days + "D " + hours + "H "
          + minutes + "m " + seconds + "s until your event!";

        // If the count down is over, write some text 
        if (distance < 0) {
          clearInterval(x);
          document.getElementById("countdown").innerHTML = "EXPIRED";
        }
      }, 1000);
    }

    function compareDate(a, b) {
      const eventA = new Date(a.EventDate);
      const eventB = new Date(b.EventDate);
    
      let comparison = 0;
      if (eventA > eventB) {
        comparison = 1;
      } else if (eventA < eventB) {
        comparison = -1;
      }
      return comparison;
    }