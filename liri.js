require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const moment = require('moment');
const fs = require('fs');

// This is where the user will input what they want to do
var action = process.argv[2];
// This is the search term the user will use
var searchTermRaw = process.argv.splice(3);
var searchTerm = searchTermRaw.join('+')

var choosewhatToDo= function(action, searchTerm) {
    switch(action) {
        case 'movie-this':
            findMovies(searchTerm)
            break

        case 'concert-this':
            break
        
        case 'spotify-this-song':
            findSongs(searchTerm)
            break

        case 'do-what-it-says':
            break

        default:
            case 'spotify-this-song':
                findSongs(searchTerm)
                break
    }
}

// This will run the function above 
choosewhatToDo(action, searchTerm)
// ------------------ Spotify Function ----------------------

function findSongs(songName) {
    // songName= searchTerm
    
    //If user has not specified a song , default to "The Sign" by Ace of Bass
    if (!songName) {
      songName = 'The Sign';
    }
  
    spotify.search({type: 'track', query: songName}).then(function(data){

        var results= data.tracks.items[0]
        console.log('Song name: ' + results.name)
        console.log('Album this Song is From: ' + results.album.name)
        console.log('Artists: ' + results.artists[0].name)
        console.log('Preview of this song: ' + results.external_urls.spotify)

    }).catch(function(err) {
        console.log(err)
    })
};

function findMovies(movieName) {

    if (!movieName) {
        movieName = 'Mr. Nobody';
        console.log('If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/')
        console.log('It\'s on Netflix!')
    }
    axios.get('http://www.omdbapi.com/?apikey=5d16cf37&t=' + movieName)
        .then(function(data) {
            var results= data.data
            console.log("Title: " + results.Title +
                        '\nYear of Release: ' + results.Year +
                        '\nRating: ' + results.Rated + 
                        '\nRotten Tomatoes Score: ' + results.Ratings[1].Value +
                        '\nCountry Movie was Produced in: ' + results.Country +
                        '\nLanguages: ' + results.Language + 
                        '\nPlot: ' + results.Plot + 
                        '\nActors: ' + results.Actors)
        })

}

