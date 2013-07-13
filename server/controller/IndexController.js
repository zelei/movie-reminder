var Controller = function(req, res){
    res.render('pages/index.ect', {user: req.user});   
}

module.exports = Controller;