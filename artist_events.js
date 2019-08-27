//var dotenv = require("dotenv").config();
var moment = require("moment");
var axios = require("axios");

var GetArtistEvents = function(artistName) {

  var bit_apid = 'c6321e9a45cf744293df09876fa6be56';
  var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=" + bit_apid;

  console.log("\nArtist Name: " + artistName);
  console.log("");
  // This line is just to help us debug against the actual URL.
  //console.log(queryUrl);

  axios.get(queryUrl).then(
    function (response) {
      var data = response.data;
      arr_len = response.data.length;

      //console.log("arr_len: "+arr_len);
      //console.log(JSON.stringify(data));

      for (i = 0; i < arr_len; i++) {
        //console.log("data[]: "+JSON.stringify(data[i]));
        eventDateRaw = data[i].datetime;
        //isValid = moment(eventDateRaw).isValid()
        //console.log("isValid: "+isValid);
        eventDate = moment(eventDateRaw).format("MM/DD/YYYY");

        //console.log("data.[].datetime: "+JSON.stringify(data[i].datetime));
        console.log("Event Date: " + eventDate);

        venueName = data[i].venue.name + "\n";
        venueAddress = "            " + data[i].venue.city + ", ";
        venueAddress += data[i].venue.region + " ";
        venueAddress += data[i].venue.country;
        console.log("Venue Name: " + venueName + venueAddress);

        //console.log("data.[].venue: "+JSON.stringify(data[i].venue));
        console.log("");
        // * Name of the venue
        // * Venue location
        // * Date of the Event (use moment to format this as "MM/DD/YYYY")

      }
      /*
      // Note: cache should not be re-used by repeated calls to JSON.stringify.
      var cache = [];
      console.log(JSON.stringify(response, function (key, value) {
        if (typeof value === 'object' && value !== null) {
          if (cache.indexOf(value) !== -1) {
            // Duplicate reference found, discard key
            return;
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      })
      );
      cache = null; 
      // Enable garbage collection
      */

      //console.log("response: " + JSON.stringify(response));
      //console.log("response[0]: " + JSON.stringify(response[0]));
      //console.log("Release Year: " + response[0].lineup);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded witha a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("---------------Status---------------");
        console.log(error.response.status);
        console.log("---------------Status---------------");
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}
  
// Exporting the Movie constructor which we will use in main.js
module.exports = GetArtistEvents;

