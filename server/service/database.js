var mongoose = require("mongoose");
var connection = mongoose.connect('mongodb://'+process.env.IP+'/data');

module.exports = {'mongoose' : mongoose, 'connection' : connection};