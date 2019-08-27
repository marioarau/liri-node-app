var Spotify = require('node-spotify-api');
var dotenv = require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var GetArtistEvents = require("./artist_events.js");
var GetMovie = require("./get_movies.js");
var GetSong = require("./spotify.js");

if (process.argv.length < 4) {
  console.log("Liri: Version 1.0");
  console.log("");
  console.log("Usage: node liri <song|event|movie> <name>");
  return;
}
inputType = process.argv[2];
inputType = inputType.toLowerCase(); //convert input type command to lower case.
inputValue = process.argv[3];
inputValue2 = process.argv.splice(3);
//console.log("argv: "+inputValue2)
inputValue2 = inputValue2.join(" "); 
//console.log("argv: "+inputValue2)

// determine the type of processing based on the argv2 value 
switch (inputType) {
  case 'song':
    console.log("Spotify Song Query: "+inputValue);
    var song = new GetSong(inputValue);
    break;
  case 'movie':
    console.log("Movie Processing: "+inputValue);
    var movie = new GetMovie(inputValue);
    break;
  case 'event':
    console.log('Artist Event Processing');
    var artistEvents = new GetArtistEvents(inputValue);
    break;
  default:
    console.log('Sorry, you have entered a incorrect input ' + inputType + '.');
}


