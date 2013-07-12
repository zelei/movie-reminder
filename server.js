var passport = require('passport');
var context = require("rekuire")("webconfiguration");
var env = context.require("/env");

context.app.get('/', context.require("/server/controller/IndexController"));

context.app.get('/search', context.require("/server/controller/SearchController"));

// OpenID
context.app.get('/auth/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.me' }));

context.app.get('/auth/google/return', passport.authenticate('google', { successRedirect: '/', failureRedirect: '/#failure' }));

context.app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

console.log('Listening on port ', env.ip , env.port);

context.app.listen(env.port, env.ip);