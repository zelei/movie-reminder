var env = require("rekuire")("env");
var mongoose = require("mongoose");

var connection = mongoose.connect('mongodb://' + env.mongo.url + '/' + env.mongo.name);

module.exports = {'mongoose' : mongoose, 'connection' : connection};