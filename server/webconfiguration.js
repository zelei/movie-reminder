var env = require('rekuire')("env");
var express = require('express');
var ect = require('ect');
var logger = require('winston');
var passport = require('passport');
var SignInService = env.require("/server/service/SignInService");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var templateDirectory = env.root + '/web/views';

var app = express();

app.configure(function() {
  
  app.set('json spaces', 0);
  
  // ECT
  app.set('views', templateDirectory);
  app.engine('.ect', ect({ watch: true, root: templateDirectory }).render);

  // Express
  app.use(express.compress());
  app.use("/static", express.static(env.root + '/web/resources', { maxAge: 86400000 }));
 // app.use(express.logger());

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(app.router);  
});

passport.use(new GoogleStrategy({
    clientID: "678201232526.apps.googleusercontent.com",
    clientSecret: "B6Cgp--Ne_MXhxOC8ak_-0au",
    callbackURL: env.host + "/auth/google/callback"
  }, SignInService.signIn));

passport.serializeUser(function(user, done) {
    done(undefined, user);
});

passport.deserializeUser(function(user, done) {
    done(undefined, user);
});


module.exports = {'app' : app, 'ect' : ect};
