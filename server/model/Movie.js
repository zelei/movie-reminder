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