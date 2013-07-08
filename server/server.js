// reference the http module so we can create a webserver
var http = require("http");

var BlogPost = require("./model/blog");

http.createServer(function(req, res) {
    
    //create new model
var post = new BlogPost({title: "My first post", author: "Yash Kumar", 
    												body: "We want to make documentation obsolete"});

    //save model to MongoDB
    /*
    post.save(function (err) {
      if (err) {
    		return err;
      }
      else {
      	console.log("Post saved");
      }
    });*/

        
    //Find one blog post by this
    BlogPost.findOne({author: "Yash Kumar"}, function(err, doc) {
        if (err) {
    		return err
    	}
    	else {
    		res.write(JSON.stringify(doc));      
    	    res.end("Hello world from Cloud9!");
        }
    });
    
}).listen(process.env.PORT, process.env.IP);
