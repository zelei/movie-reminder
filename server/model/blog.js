var mongoose = require("mongoose");
var database = require("../service/database");


//create schema for blog post
var blogSchema = new database.mongoose.Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});

//compile schema to model
module.exports = database.connection.model('blog', blogSchema)