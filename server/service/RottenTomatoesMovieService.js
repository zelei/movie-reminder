var context = require("rekuire")("webconfiguration");
var jsonUtil = context.require("/server/util/JsonUtil");
var http = require("http");

var MovieService = function(apiKey){

    this.apiKey = apiKey;

    this.search = function(query, success, error) {
        var url = '/api/public/v1.0/movies.json?apikey=' + this.apiKey + '&q=' + encodeURIComponent(query);
        callApi(url, success, error, convertMovieToShortDescription);   
    }
    
    this.listUpcoming = function(query, success, error) {
        var url = '/api/public/v1.0/lists/movies/upcoming.json?apikey=' + this.apiKey + '&page_limit=16&page=1&country=us';
        callApi(url, success, error, convertMovieToBriefDescription);
    }
    
    function callApi(url, success, error, converter) {
        
        var options = {
            host: 'api.rottentomatoes.com',
            port: 80,
            path: url  
        };
        
        http.get(options, function(response) {
        
            jsonUtil.responseToJson(response, function(moviesData) {
                success(converter(moviesData))           
            });
        
        }).on('error', function(e) {
          error(e);
        });  
    }
    
    function convertMovieToBriefDescription(moviesData) {                  
        var movies = [];

        if(moviesData.total > 0) {           
            for (var i = 0; i < moviesData.movies.length; i++) {
                var movie = moviesData.movies[i];
                movies.push({ 'id' : movie.id
                            , 'title' : movie.title
                            , 'thumbnail' : movie.posters.thumbnail
                            , 'synopsis' : movie.synopsis
                            , 'release_dates' : movie.release_dates.theater});
            }
        }
        
        return movies;
    }
    
    function convertMovieToShortDescription(moviesData) {                  
        var movies = [];

        if(moviesData.total > 0) {           
            for (var i = 0; i < moviesData.movies.length; i++) {
                var movie = moviesData.movies[i];
                movies.push({'id' : movie.id,
                             'title' : movie.title, 
                             'thumbnail' : movie.posters.thumbnail});
            }
        }
        
        return movies;
    }
    
}

module.exports = new MovieService("g2s78atyq2725dc65zau9cyv");