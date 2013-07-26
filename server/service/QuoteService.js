var when = require("when");
var cache = require('memory-cache');

var QuoteService = function(){

    this.getRandomQuote = function() {
        
        var deferred = when.defer();
        
        this.loadDataFromGoogleSheet().then(function(quotes) {
            var randomIndex = Math.floor(Math.random() * 100) % quotes.length;
            return quotes[randomIndex];    
        }).then(deferred.resolve, deferred.reject);
            
        return deferred.promise;
        
    };
    
    this.loadDataFromGoogleSheet = function() {
        
        var deferred = when.defer();
        
        var quotes = [];
        
        quotes.push({text : 'Toto, I\'ve got a feeling we\'re not in Kansas anymore.', character: 'Dorothy Gale', movie: 'The Wizard of Oz'});  
        quotes.push({text : 'Here\'s looking at you, kid.', character: 'Rick Blaine', movie: 'Casablanca'});
        quotes.push({text : 'Go ahead, make my day.', character: 'Harry Callahan', movie: 'Sudden Impact'});
        quotes.push({text : 'All right, Mr. DeMille, I\'m ready for my close-up.', character: 'Norma Desmond', movie: 'Sunset Boulevard'});
        quotes.push({text : 'May the Force be with you.', character: 'Han Solo', movie: 'Star Wars'});
        quotes.push({text : 'Fasten your seatbelts. It\'s going to be a bumpy night.', character: 'Margo Channing', movie: 'All About Eve'});
        quotes.push({text : 'You talkin\' to me?', character: '	Travis Bickle', movie: 'Taxi Driver'});
        quotes.push({text : 'I love the smell of napalm in the morning.', character: 'Lt. Col. Bill Kilgore', movie: 'Apocalypse Now'});

        deferred.resolve(quotes);
                   
        return deferred.promise;
        
    };
    
};

module.exports = new QuoteService();