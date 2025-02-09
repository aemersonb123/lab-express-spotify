require('dotenv').config();

const { response, request } = require('express');
const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');
//^^^ it #1 num:3
const app = express();

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res, next) => {
  response.render('home')
});

app.get('/artist-search', (req, res, next) => {
  const {artistName} = request.query;
  spotifyApi
  .searchArtists(artistName)
    .then( (data) => {
        console.log('data received from API:', data.body.artists.items[0]);
        response.render('artist-search-results', {artists: data.body.artists.items});
    })
    .catch( (error) => {
        console.log('Error ocurred while searching artists.', error);
    });
});

app.get('/albums/:theID', (req, res,) => {
  const {theId} = request.params

  spotifyApi
  .getArtistAlbums(theId)
  .then( (data) => {
    console.log('Artist albums', data.body.items);
    response.render('albums', {albums: data.body.items});
  })
  .catch( error => console.log('Somthing went wrong getting the artist album', error));

  });

  app.get('/tracks/:theId', (request, response) => {

    const {theId} = request.params;
    spotifyApi
    .getAlbumTracks(theId)
    .then( (data) => {
     console.log('Data received from API:', data.body.items);
     response.render('tracks', {tracks: data.body.items});
    })
})


  


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
