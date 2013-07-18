

var Link = function(name, url) {
    this.name = name;
    this.url = url; 
    
    this.clone = function() {
        return new Link(this.name, this.url);
    }
    
}

module.exports = Link;