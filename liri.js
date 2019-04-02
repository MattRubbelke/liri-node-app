require("dotenv").config();

// Packages needed
var Spotify = require("node-spotify-api");
var axios = require("axios")
var keys = require("./key");
var fs = require("fs");
var moment = require("moment");
var spotify = new Spotify(keys.spotify);

// Creates the command and userInput variables 
var command = process.argv[2];
var userInput = process.argv[3]

// Allows the user to add to the userInput variable (i.e. for more than one-word answers)
for (var i = 4; i < process.argv.length; i++) {
    if (i > 4 && i < process.argv.length) {
        userInput += "+" + process.argv[i]; 
    }
    else {
        userInput += "+" + process.argv[i];
    }
}

// console logs the user input to ensure it will be read by the API's
console.log("This is the user's input: "+ userInput);

// Bands In Town
if (command === "concert-this"){
    var artist = userInput;
    console.log("This is the artist: "+ artist)
    var queryURL = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id="+ keys.bandsInTown.id;
    axios.get(queryURL).then(function(response, err){
        if (err){
            console.log(err);
            return;
        }
        for (var i=0; i < response.data.length; i++){
            console.log("Venue Name: " + response.data[i].venue.name);
            console.log("Event Location: " + response.data[i].venue.city);
            console.log("Event Date: " + moment(response.data[i].datetime).format("L"));
        }
        if (response.data.length === 0){
            console.log("Hmmm. It looks like this artist isn't on tour.")
        }
    })
}

// Spotify
else if (command === "spotify-this"){
    var songName = userInput;
    if (!songName){
        songName = "the+sign+ace+of+base"
    }
    spotify.search({type: "track", query: songName}, function(err, data){
        if (err){
            console.log(err);
            return;
        }
        var artistSong = data.tracks.items;
        console.log("Artist: " + artistSong[0].artists[0].name)
        console.log("Song's name: " + artistSong[0].name);
        console.log("Preview link of song: " + artistSong[0].preview_url);
        console.log("Album: " + artistSong[0].album.name)
    })
}

// OMDb 
else if (command === "movie-this"){
    var movieName = userInput;
    if (!movieName){
        movieName = "Mr+Nobody";
    }
    console.log("This is the user's movie input: "+ movieName);
    var queryURL = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey="+keys.ombd.key;
    axios.get(queryURL).then(function(response, err){
        if (err){
            console.log(err);
            return
        }
        console.log("This is the title of the movie: " + response.data.Title);
        console.log("This is the year the movie was released: " + response.data.Year);
        console.log("This is the IMDB Rating: " + response.data.imdbRating);
        console.log("This is the Rotten Tomatoes rating of the movie: "+response.data.Ratings[1].Value);
        console.log("This is the country where the movie was produced: "+response.data.Country);
        console.log("This is the movie's plot: "+response.data.Plot);
        console.log("The following actors star in this movie: "+ response.data.Actors)
    })

}

// Do What It Says Command - Reads the text file and spotifies the text file song.
else if (command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(err, data){
        if (err){
            console.log(err);
            return;
        }
    
        var userInput = data.split(",")
        console.log(userInput)

        var songName = userInput[1]

        spotify.search({type: "track", query: songName}, function(err, data){
            if (err){
                console.log(err);
                return;
            }
            var artistSong = data.tracks.items;
            console.log("Artist: " + artistSong[0].artists[0].name)
            console.log("Song's name: " + artistSong[0].name);
            console.log("Preview link of song: " + artistSong[0].preview_url);
            console.log("Album: " + artistSong[0].album.name)
        })
    })
}