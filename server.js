process.env.NODE_ENV = 'production';

var request = require('request');
var passport = require('passport');
var context = require("rekuire")("webconfiguration");
var env = require("rekuire")("env");

var movieController = env.require("/server/controller/MovieController").getInstance();
var searchController = env.require("/server/controller/SearchController").getInstance();

context.app.get('/', env.require("/server/controller/IndexController"));

context.app.get('/movie/search', searchController.search);

context.app.get('/movie/quote', movieController.randomQuote);

context.app.get('/movie/mymovies', movieController.myMovies);

context.app.get('/movie/upcoming', movieController.upcoming);

context.app.post('/movie/mark', movieController.mark);

context.app.post('/movie/unmark', movieController.unmark);

// Auth2
context.app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email',
                                            'https://www.googleapis.com/auth/calendar'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });


context.app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


context.app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


context.app.get('/calendar', function(req, res){

    var callback = function (error, response, body) {
        if(error) return res.send(500,error);
        return res.send(body);
    };
    
    var uri = "https://www.googleapis.com/calendar/v3/calendars?access_token=" + req.user.accessToken;
    var body = {"summary" : "Movie Reminder"};
    
    request({ method: 'POST', uri: uri, json:true, body: body }, callback);

});


console.log('Listening on port ', env.ip , env.port, process.env.NODE_ENV);

context.app.listen(env.port, env.ip);