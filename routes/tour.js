var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.loggedin === true && req.session.role === 'TAdmin'){
        res.render('tadmin/index', { title: 'Express' });
    } else {
        req.flash('error', 'Not Tour Admin')
        res.redirect('/login/tour_login')
    }
});

module.exports = router;