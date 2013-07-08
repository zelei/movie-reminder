var env = require('rekuire')("env");
var express = require('express');
var ect = require('ect');
var winston = require('winston');

var templateDirectory = env.root + '/web/views';

var app = express();
app.set('views', templateDirectory);
app.use(express.static(env.root + '/web/resources'));

app.engine('.ect', ect({ watch: true, root: templateDirectory }).render);

var loadModule = function(moduleName) {
    winston.info("Load module:", moduleName);
    return require(env.root + moduleName); 
};

module.exports = {'app' : app, 'ect' : ect, 'require' : loadModule };
