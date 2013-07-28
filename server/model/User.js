var context = require("rekuire")("env");
var database = context.require("/server/service/Database");

context.require("/server/model/SelectedMovie");
var SelectedMovieSchema = database.mongoose.model('SelectedMovie').schema;

var UserSchema = new database.mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  accessToken: { type: String, required: true },
  calendarId: { type: String, required: false },
  selectedMovies: [SelectedMovieSchema]
});

//compile schema to model
module.exports = database.connection.model('User', UserSchema);