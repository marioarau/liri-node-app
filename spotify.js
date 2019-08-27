var dotenv = require("dotenv").config();
var Spotify = require('node-spotify-api');

/*
  * Artist(s)
  * The song's name
  * A preview link of the song from Spotify
  * The album that the song is from
   * If no song is provided then your program will default to "The Sign" by Ace of Base.
*/
var GetSong = function (songName) {

    var spotify = new Spotify({
        id: "2d823ae89051450f9eedb26a185a0b4a",
        secret: "caeb307cd6114e82aa323100cad95eb2"
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

// Exporting the Movie constructor which we will use in main.js
module.exports = GetSong;
