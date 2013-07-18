var context = require("rekuire")("env");
var database = context.require("/server/service/Database");

//create schema for blog post
var userSchema = new database.mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  selectedMovies: [Number]
});

//compile schema to model
module.exports = database.connection.model('User', userSchema)