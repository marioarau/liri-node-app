console.log('key is loaded');

exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};

exports.omdb = {
  apikey: process.env.OMDB_ID
};

exports.bid = {
 api_key: process.env.BANDS_IN_TOWN_ID 
}