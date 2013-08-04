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
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use("/static", express.static(env.root + '/web/resources', { maxAge: 1000*60*60*24*30*12  }));
  app.use(express.logger());

  app.use(express.cookieParser());
  app.use(express.bodyParser());
  
  app.use(express.session({   
      secret: 'SOMETHING_REALLY_HARD_TO_GUESS',   
      cookie: {  
        path     : '/',  
        maxAge   : 1000*60*60*24*30*12    //one year(ish)  
      }   
    }));

  
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(app.router);  
});

passport.use(new GoogleStrategy({
    clientID: env.google.clientID,
    clientSecret: env.google.clientSecret,
    callbackURL: env.host + "/auth/google/callback"
  }, SignInService.signIn));

passport.serializeUser(function(user, done) {
    done(undefined, user);
});

passport.deserializeUser(function(user, done) {
    done(undefined, user);
});


module.exports = {'app' : app, 'ect' : ect};
