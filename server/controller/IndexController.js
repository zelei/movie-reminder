var Controller = function(req, res){
    res.render('pages/index/index.ect', {user: req.user});   
}

module.exports = Controller;