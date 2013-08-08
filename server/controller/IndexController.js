var env = require('rekuire')("env");
var FileUtil = env.require("/server/util/FileUtil");

var generatedFileName = 'index' + new Date().getTime() + ".js"; 

FileUtil.concat({
    src : [
        '/web/resources/client/service/Application.js',
        '/web/resources/client/service/MovieWebService.js',
        '/web/resources/client/controller/QuoteWebController.js',
        '/web/resources/client/controller/SearchListWebController.js',
        '/web/resources/client/controller/SearchFormWebController.js',
        '/web/resources/client/controller/UpcomingWebController.js',
        '/web/resources/client/controller/WatchListWebController.js',
        '/web/resources/client/controller/TopMoviesWebController.js'
    ],
    dest : '/web/resources/generated/' + generatedFileName
});

var Controller = function() {
    
    this.index = function(req, res){
        res.render('pages/index/index.ect', {user: req.user, mainjs: generatedFileName});   
    };

};

module.exports = { getInstance : function() {return new Controller()}};