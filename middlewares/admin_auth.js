function admin_auth(req,res,next){
    console.log('oi' + req.session.user)
    if (req.session.user != undefined){
        next();
    }
    else{
        res.redirect('/login')
    }
}

module.exports = admin_auth;