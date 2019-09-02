var fs = require("fs");
var Spotify = require('node-spotify-api');
var dotenv = require("dotenv").config();
var moment = require("moment");
var axios = require("axios");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var cmdline = false;

var exitProgram = false;
//var GetArtistEvents = require("./artist_events.js");

function getMovie(movieName) {

  if (typeof movieName == "undefined") {
    inquirer.prompt([
      {
        name: "movieName",
        message: "What is the <movieName>?",
        default: "Mr. Nobody"
      }
    ]).then(function (answers) {
      var movieName = answers.movieName;
      getMovieAxios(movieName);
      getInputType();
    });
  }
  else {
    //console.log("movieName: " + movieName);
    getMovieAxios(movieName);
  }
}

function getMovieAxios(movieName) {

  // Then run a request with axios to the OMDB API with the movie specified
  //console.log("keys: "+JSON.stringify(keys))
  var omdb_apikey = keys.omdb.apikey;
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + omdb_apikey;

  // This line is just to help us debug against the actual URL.
  //console.log(queryUrl);

  //* Title of the movie.
  //* Year the movie came out.
  //* IMDB Rati(ng of the movie
  //* Ranguage of the movie.
  //* Plot of the ovie.
  //* Actors in the movie.

  axios.get(queryUrl).then(
    function (response) {
      //console.log(response.data);
      title = response.data.Title;
      year = response.data.Year;
      language = response.data.Language;
      plot = response.data.Plot;
      actors = response.data.Actors;
      ratingsIMDB = response.data.Ratings[0].Value;
      ratingsRT = response.data.Ratings[1].Value;
      ratingsMC = response.data.Ratings[2].Value;
      console.log("");
      console.log("Title: " + title);
      console.log("Release Year: " + year);
      console.log("Language: " + language);
      console.log("Plot: " + plot);
      console.log("Actors: " + actors);
      console.log("Rating IMDB: " + ratingsIMDB);
      console.log("Rating Rotten Tomatoes: ", ratingsRT);
      console.log("Rating Metacritic: ", ratingsMC);
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log("---------------Data---------------");
        console.log(error.response.data);
        console.log("-------      --------Status---------------");
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

function getSong(songName) {

  if (typeof songName == "undefined") {
    inquirer.prompt([
      {
        name: "songName",
        message: "What is the <song name>?",
        default: "The Sign"
      }
    ]).then(function (answers) {

      var songName = answers.songName;
      getSongSpotify(SongName);
      getInputType();
    });
  }
  else {
    console.log("songName: " + songName);
    getSongSpotify(songName);
  }

}

function getSongSpotify(songName) {

  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

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
  });
}

function getArtistEvents(artistName) {

  if (typeof artistName == "undefined") {
    inquirer.prompt([
      {
        name: "artistName",
        message: "What is the <artist name>?",
        default: "Los Lobos"
      }
    ]).then(function (answers) {

      var artistName = answers.artistName;
      getArtistEventsAxios(artistName);
      getInputType();
    });
  }
  else {
    //console.log("artistName: " + artistName);
    getArtistEventsAxios(artistName);
  }
}

function getArtistEventsAxios(artistName) {

  var bit_apid = 'c6321e9a45cf744293df09876fa6be56';
  var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=" + bit_apid;

  //console.log("\n::::Artist Name: " + artistName);
  //console.log("");
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
        getInputType();
    }
  });
}

function processInputType(inputType, inputValue) {

  switch (inputType) {
    case 'spotify-this-song':
      //console.log("Spotify Song Query");
      if (typeof inputValue == "undefined") {
        inputValue = "The Sign";
      }
      getSong(inputValue);
      break;
    case 'movie-this':
      //console.log("Movie Processing: ");
      if (typeof inputValue == "undefined") {
        inputValue = "Mr. Nobody";
      }
      getMovie(inputValue);
      break;
    case 'concert-this':
      //console.log('Artist Event Processing:');
      if (typeof inputValue == "undefined") {
        inputValue = "Los Lobos";
      }
      getArtistEvents(inputValue);
      break;
    case 'exit':
      return true;
      break;
    default:
      console.log('Sorry, you have entered a incorrect input ' + inputType + '. Type exit to quit.');
  }
}

if (process.argv.length == 2) {
  getInputType();
}
else if (process.argv.length == 3) {
  cmdline = true;
  inputType = process.argv[2];
  if (inputType == "do-what-it-says") {
    // This block of code will read from the "movies.txt" file.
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function (error, data) {

      // If the code experiences any errors it will log the error to the console.
      if (error) {
        return console.log(error);
      }

      data = data.trim();
      console.log("random.txt: "+data);
      // Then split it by commas (to make it more readable)
      var dataArr = data.split(" ");
      inputType = dataArr[0];
      dataArr = dataArr.splice(1);
      inputValue = dataArr.join(" ");

      // We will then re-display the content as an array for later use.
      //console.log(dataArr);
      //console.log("inputType: " + inputType);
      //console.log("inputValue: " + inputValue);
      processInputType(inputType, inputValue);

    });
  }
  else {
    processInputType(inputType);
  }
}
else if (process.argv.length >= 4) {
  cmdline = true;
  inputType = process.argv[2];
  inputValue = process.argv.slice(3)
  inputValue = inputValue.join(" ");
  //console.log("inputType: " + inputType);
  //console.log("inputValue: " + inputValue);

  processInputType(inputType, inputValue);
}
