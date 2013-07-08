var context = require("rekuire")("webconfiguration");

context.app.get('/', context.require("/server/controller/IndexController"));

context.app.get('/search', context.require("/server/controller/SearchController"));

context.app.get('/upcoming', context.require("/server/controller/UpcomingController"));

context.app.listen(process.env.PORT || '8080', process.env.IP || '127.0.0.1' );
console.log('Listening on port ' + process.env.IP);
