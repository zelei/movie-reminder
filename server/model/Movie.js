var Movie = function(id, title, thumbnail, synopsis, releaseDate, links, trailers) {
    this.id = id;
    this.title = title;
    this.thumbnail = thumbnail;
    this.synopsis = synopsis;
    this.releaseDate = new Date(releaseDate);
    this.links = links || [];
    this.trailers = trailers || [] ;
    
    this.clone = function() {
        return new Movie( this.id
                        , this.title
                        , this.thumbnail
                        , this.synopsis
                        , new Date(this.releaseDate)
                        , this.links.map(function(link) {return link.clone()})
                        , this.trailers.map(function(trailer) {return trailer.clone()}));
    };
        
};

    
Movie.compare = function(a,b) {
    
    if(a.releaseDate && b.releaseDate) {
        
        if (a.releaseDate < b.releaseDate) {return -1;}
        if (a.releaseDate > b.releaseDate) {return 1;}
        
        if(a.title && b.title) {
            if (a.title < b.title) {return -1;}
            if (a.title > b.title) {return 1;}
            return 0;
        } 
    
    }
    
    if(a.title && b.title) {
        if (a.title < b.title) {return -1;}
        if (a.title > b.title) {return 1;}
        return 0;
    } 
    
};

module.exports = Movie;