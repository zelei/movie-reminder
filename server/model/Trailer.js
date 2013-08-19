
var Trailer = function(pubDate, embed) {
    this.pubDate = new Date(pubDate);
    this.embed = embed; 
    
    this.clone = function() {
        return new Trailer(new Date(this.pubDate), this.embed);
    }
    
}

module.exports = Trailer;