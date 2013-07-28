var context = require("rekuire")("env");
var database = context.require("/server/service/Database");

var SelectedMovieSchema = new database.mongoose.Schema({
  movieId: { type: String, required: true },
  eventId: { type: String, required: true }
});

//compile schema to model
module.exports = database.connection.model('SelectedMovie', SelectedMovieSchema);