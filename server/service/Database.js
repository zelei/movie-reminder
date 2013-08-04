var env = require("rekuire")("env");
var mongoose = require("mongoose");

var options = {
  server: { poolSize: 5 }
};

if(env.mongo.user && env.mongo.password) {
    options.user = env.mongo.user;
    options.pass = env.mongo.password;
}

var connection = mongoose.connect('mongodb://' + env.mongo.url + '/' + env.mongo.name, options);

module.exports = {'mongoose' : mongoose, 'connection' : connection};