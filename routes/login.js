var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET home page. */
router.get('/dolphin_cove_login', (req, res) => {
    res.render('super_admin/login', {title: 'Login Page'})
});

// Check auth
router.post('/slogin', function(req, res, next) {
        username = req.body.username,
        password = req.body.password
    
    // conn.query('SELECT * FROM admin WHERE username = ? AND BINARY password = ?', [username, password], (err, results) => {
    conn.query('SELECT admin.*, role.role FROM admin, role WHERE username = ? AND BINARY password = ? AND admin.role_id = role.id', [username, password], (err, results) => {
        console.log(results)
        
        if (results.length <= 0) {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login/dolphin_cove_login')
        } else {
            req.session.loggedin = true
            req.session.uid = results[0].id,
            req.session.admin_fn = results[0].admin_fn,
            req.session.admin_ln = results[0].admin_ln,
            req.session.role_id = results[0].role_id,
            req.session.role = results[0].role
            res.redirect('/admin');
             
        }
    });
});

// Logout Super Admin
router.get('/sadminlogout', function (req, res) {
    req.session.destroy();
    res.redirect('/login/dolphin_cove_login');
  });

/* ********************************************************************************** */
// Tour Login

router.get('/tour_login', (req, res) => {
    res.render('tadmin/login', {title : 'Tour | Login'})
});


router.post('/tourAuth', (req, res) => {

    username = req.body.username,
    password = req.body.password
    conn.query('SELECT tour_admin.*, role.role, tour_company.tour_company FROM tour_admin, role, tour_company WHERE username= ? AND password = ? AND tour_admin.role_id = role.id AND tour_admin.company_id = tour_company.id', [username, password], (err, results) => {
        console.log(results)
        if (results.length <= 0) {
            req.flash('error', 'Incorrect username or password');
            res.redirect('/login/tour_login')
        } else {
            req.session.loggedin = true
            req.session.uid = results[0].id,
            req.session.tour_fn = results[0].tour_fn,
            req.session.tour_ln = results[0].tour_ln,
            req.session.role_id = results[0].role_id,
            req.session.company_id = results[0].company_id,
            req.session.role = results[0].role
            req.session.company = results[0].tour_company
            res.redirect('/tour_admin');
            console.log(req.session.role)
        }
    });

})

// Logout Tour Admin
router.get('/tadminlogout', function (req, res) {
    req.session.destroy();
    res.redirect('/login/tour_login');
  });

module.exports = router;