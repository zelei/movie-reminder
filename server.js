var context = require("rekuire")("webconfiguration");

context.app.get('/', context.require("/server/controller/IndexController"));

context.app.get('/search', context.require("/server/controller/SearchController"));

context.app.get('/upcoming', context.require("/server/controller/UpcomingController"));

var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || process.env.IP  || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080;

console.log('Listening on port ', ipaddr , port);

context.app.listen(port, ipaddr);

