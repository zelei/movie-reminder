var env = require('rekuire')("env");
var express = require('express');
var ect = require('ect');
var logger = require('winston');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

var User = env.require("/server/model/User");

passport.use(new GoogleStrategy({
    returnURL: env.host + '/auth/google/return',
    realm: env.host
    },  function(identifier, profile, done) {
           
            var query = {"id": identifier};
            var options = {upsert: true};
            var user = {"id": identifier, "name": profile.name.givenName};
                  
            User.findOneAndUpdate(query, user, options, function(err, person) {
                done(err, person);
            });
            
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
  //app.use(express.logger());
  app.use(express.compress());
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


module.exports = {'app' : app, 'ect' : ect};
