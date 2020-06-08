require('dotenv').config();
// This is pulls the keys for the Spotify API from the key.js file
const keys = require('./keys.js');
// This allows us to use the node api, otherwise an error will pop up
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const axios = require('axios').default;
const moment = require('moment');
const fs = require('fs');

// This is where the user will input what they want to do
var action = process.argv[2];
// This is the search term the user will use
var searchTermRaw = process.argv.splice(3);
// This will join the search term above with plus signs for the urls
var searchTerm = searchTermRaw.join('+')

var choosewhatToDo= function(action, searchTerm) {
    switch(action) {
        case 'movie-this':
            findMovies(searchTerm)
            break

        case 'concert-this':
            findConcerts(searchTerm)
            break
        
        case 'spotify-this-song':
            findSongs(searchTerm)
            break

        case 'do-what-it-says':
            itDo()
            break

        default:
            // If no input is typed into the node terminal, then this will run instead of throwing an error
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

        // This variable makes it so that I don't have to type the same long string of characters in for each piece of data I'm pulling
        // from the api
        var results= data.tracks.items[0]
        console.log('Song name: ' + results.name)
        console.log('Album this Song is From: ' + results.album.name)
        console.log('Artists: ' + results.artists[0].name)
        console.log('Preview of this song: ' + results.external_urls.spotify)

    }).catch(function(err) {
        console.log(err)
    })
};

// --------------------- OMDB Function -------------------------------

function findMovies(movieName) {

    // If no movie name is typed, this will appear
    if (!movieName) {
        movieName = 'Mr. Nobody';
        console.log('If you haven\'t watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/')
        console.log('It\'s on Netflix!')
    }
    axios.get('http://www.omdbapi.com/?apikey=5d16cf37&t=' + movieName)
        .then(function(data) {
            var results= data.data
            // The \n creates a new line for each of the following pieces of information
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

// ------------------------ Bands in Town Function --------------------------

function findConcerts(artist) {

    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(data) {
        var results= data.data[0]
        var date= results.datetime
        var dateofConcert= moment(date).format('MM/DD/YYYY')
        console.log('Name of the Venue: ' + results.venue.name + 
                    '\nVenue Location: ' + results.venue.location +
                    '\nDate of the Concert: ' + dateofConcert)
    })

}

// --------------------------- Do What It Says --------------------------------

function itDo() {

    fs.readFile('random.txt', 'utf8', function(err,data) {
        if (err) {
            console.log(err)
        }

        var randomArr= data.split(',')
        var action= randomArr[0]
        var input= randomArr[1]
        choosewhatToDo(action,input)
    })
}