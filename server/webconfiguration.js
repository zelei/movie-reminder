var env = require('rekuire')("env");
var express = require('express');
var ect = require('ect');
var logger = require('winston');
var passport = require('passport')
var GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: env.host + '/auth/google/return',
    realm: env.host
  },
  
  function(identifier, profile, done) {
    done(null, {id : 42, profile: profile});
  }
  
));

var templateDirectory = env.root + '/web/views';

var app = express();

app.configure(function() {
  
  // ECT
  app.set('views', templateDirectory);
  app.engine('.ect', ect({ watch: true, root: templateDirectory }).render);

  // Express
  app.use(express.static(env.root + '/web/resources'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use(app.router);  
});

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

var loadModule = function(moduleName) {
    logger.info("Load module:", moduleName);
    return require(env.root + moduleName); 
};

module.exports = {'app' : app, 'ect' : ect, 'require' : loadModule };
