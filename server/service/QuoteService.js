var env = require("rekuire")("env");
var when = require("when");
var fs = require('fs');
var cache = require('memory-cache');
var csv = require('csv');

var QuoteService = function(resourceFile){

    this.getRandomQuote = function() {
        
        var deferred = when.defer();
        
        this.loadDataFromGoogleSheet().then(function(quotes) {
            var randomIndex = Math.floor(Math.random() * 100) % quotes.length;
            return quotes[randomIndex];    
        }).then(deferred.resolve, deferred.reject);
            
        return deferred.promise;
        
    };
    
    this.loadDataFromGoogleSheet = function() {
    
        if(getFromCache()) {
            return when.resolve(getFromCache());
        } 
        
        var deferred = when.defer();
        
        csv()
        .from.stream(fs.createReadStream(resourceFile))
        .to.array(function(quotes) {
            deferred.resolve(putIntoCache(quotes));
        }).transform(convertRowToQuote);
        
        return deferred.promise;
    
    };
    
    function convertRowToQuote(row){
        return {text : row[0], character: row[1], movie: row[2]};
    }
    
    function putIntoCache(quotes) {
        cache.put("quotes", quotes);
        return quotes;    
    }
    
    function getFromCache() {
        return cache.get('quotes');
    }
    
};

module.exports = new QuoteService(env.root+'/server/resources/quotes.csv');