

var Movie = function(id, imdbId, title, thumbnail, synopsis, releaseDate, links) {
    this.id = id;
    this.imdbId = imdbId;
    this.title = title;
    this.thumbnail = thumbnail;
    this.synopsis = synopsis;
    this.releaseDate = releaseDate;
    this.links = links;
    
    this.clone = function() {
        return new Movie( this.id
                        , this.imdbId
                        , this.title
                        , this.thumbnail
                        , this.synopsis
                        , this.releaseDate
                        , this.links.map(function(link) {return link.clone()}));
    };
    
};

module.exports = Movie;