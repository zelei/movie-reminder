

var Movie = function(id, title, thumbnail, synopsis, releaseDate, links) {
    this.id = id;
    this.title = title;
    this.thumbnail = thumbnail;
    this.synopsis = synopsis;
    this.releaseDate = releaseDate;
    this.links = links;
    
    this.clone = function() {
        return new Movie( this.id
                        , this.title
                        , this.thumbnail
                        , this.synopsis
                        , this.releaseDate
                        , this.links.map(function(link) {return link.clone()}));
    }
}

module.exports = Movie;