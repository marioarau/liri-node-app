var Spotify = require('node-spotify-api');
var dotenv = require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var GetArtistEvents = require("./artist_events.js");
var Movie = require("./get_movies.js");
//var Song = require("./spotify.js");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var exitProgram = false;
//var GetArtistEvents = require("./artist_events.js");

function getArtistEvents() {

  inquirer.prompt([
    {
      name: "artistName",
      message: "What is the <artist name>?"
    }
  ]).then(function (answers) {

    artistName = answers.artistName;

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
          getInputType();
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
  });
}

function getMovie(movieName) {

  inquirer.prompt([
    {
      name: "movieName",
      message: "What is the <movie name>?"
    }
  ]).then(function (answers) {

    movieName = answers.movieName;

    // Then run a request with axios to the OMDB API with the movie specified
    var omdb_apikey = 'b13ad73b';
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + omdb_apikey;

    // This line is just to help us debug against the actual URL.
    //console.log(queryUrl);

    axios.get(queryUrl).then(
      function (response) {
        console.log(response.data);
        console.log("");
        console.log("Release Year: " + response.data.Year);
        getInputType();
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
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
  });
}

function getSong() {

  var spotify = new Spotify({
     id:    keys.spotify.id,
    secret: keys.spotify.secret
  });

  inquirer.prompt([
    {
      name: "songName",
      message: "What is the <song name>?"
    }
  ]).then(function (answers) {

    songName = answers.songName;

    spotify.search({ type: 'track', query: songName }, function (err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      item = data.tracks.items;

      for (i = 0; i < item.length; i++) {
        // need song name, album, spotify link, 
        // if no song is found default to The Sign by Aces of Base
        //console.log("Item "+i+".artists: "+JSON.stringify(item[i].artists));
        //console.log("");
        //console.log("Item["+i+"].artists[0].external_urls.spotify: "+JSON.stringify(item[i].artists[0].external_urls.spotify));
        //console.log("");
        //console.log("Item["+i+"].artists[0].name: "+JSON.stringify(item[i].artists[0].name));
        //console.log("Item["+i+"].artists[0].name: "+item[i].artists[0].name);
        //console.log("");

        url = item[i].artists[0].external_urls.spotify;
        name = item[i].artists[0].name;
        albumName = item[i].name;


        console.log("Song: " + songName);
        console.log("Artist Name: " + name);
        console.log("Album: " + albumName);
        console.log("URL: " + url);
        console.log("");
        //console.log("Item "+i+": "+JSON.stringify(item[i]));
      }
      getInputType();
    });
  });
}

function getInputType() {
  // determine the type of processing based on the argv2 value 

  inquirer.prompt([
    {
      name: "inputType",
      message: "Liri asks: What is the command <concert-this|spotify-this-song|movie-this|exit>?"
    }
  ]).then(function (answers) {
    // initializes the variable newProgrammer to be a programmer object which will
    // take in all of the user's answers to the questions above

    //console.log("answers.inputType: " + answers.inputType);
    //console.log("answers.inputValue: " + answers.inputValue);

    switch (answers.inputType) {
      case 'spotify-this-song':
        //console.log("Spotify Song Query");
        getSong();
        break;
      case 'movie-this':
        //console.log("Movie Processing: ");
        getMovie();
        break;
      case 'concert-this':
        //console.log('Artist Event Processing:');
        getArtistEvents();
        break;
      case 'exit':
        return;
        break;
      default:
        console.log('Sorry, you have entered a incorrect input ' + answers.inputType + '. Type exit to quit.');
    }
    inputType = answers.inputType;
  });
}

getInputType();

