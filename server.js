process.env.NODE_ENV = 'production';

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

// OpenID
context.app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.me' }));

context.app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/#failure' }));

context.app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

console.log('Listening on port ', env.ip , env.port, process.env.NODE_ENV);

context.app.listen(env.port, env.ip);