var express = require('express');
var router = express.Router();
var  conn = require('../lib/db')

router.get('/', function(req, res, next) {
    if(req.session.loggedin === true && req.session.role === 'TAdmin'){
        conn.query(`SELECT  (SELECT COUNT(id) FROM tour_admin) AS admin_amount,
            (SELECT COUNT(id) FROM tour_reserves) AS request_amount`, (err, results) => {
            console.log(results)
            if(err) {
                req.flash('error', 'not working')
                res.render('tadmin/index', { 
                    title: 'Tour Portal', 
                    counters: '',
                    my_session : req.session
                });
            } else {
                res.render('tadmin/index', { 
                    title: 'Tour Portal', 
                    counters: results[0],
                    my_session : req.session
                });
            }
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});

/**************************************************************** */
// Get View Employee

router.get('/view_staff', (req, res) => {
    
    let sql = 'SELECT *, td.id AS tadmin_id FROM dolphin_cove.tour_admin td, dolphin_cove.role rle WHERE td.role_id = rle.id ORDER BY td.id'
    if (req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('tadmin/tadmin_views/view_staff',
                {
                    title: 'Tour Staff',
                    staff: '',
                    my_session : req.session
                })
            }else {
                res.render('tadmin/tadmin_views/view_staff',
                {
                    title: 'Tour Staff',
                    staff: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

// GET ADD EMPLOYEE
router.get('/add_staff', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'TAdmin'){
        res.render('tadmin/add/add_staff', {
            title: 'Add Employee',
            my_session : req.session
        });
    } else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

// Add Employee
router.post('/add_employ', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.tour_admin SET ?";
    let data = {
        tour_fn : req.body.fName,
        tour_ln : req.body.lName,
        username : req.body.username,
        password : req.body.password,
        role_id : req.body.role
    };
    if (req.session.loggedin == true && req.session.role === 'TAdmin') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('error', 'Error, Try Again');
                res.redirect('/tadmin/add_staff');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/tadmin/add_staff');
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

/* ***************************************************************************** */
// Get View Hotels

router.get('/view_hotels', (req, res) => {
    
    let sql = 'SELECT * FROM dolphin_cove.hotels ORDER BY id'
    if (req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('tadmin/tadmin_views/view_hotels',
                {
                    title: 'Hotels',
                    hotels: '',
                    my_session : req.session
                })
            }else {
                res.render('tadmin/tadmin_views/view_hotels',
                {
                    title: 'Hotels',
                    hotels: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

// GET ADD Hotel
router.get('/add_hotel', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'TAdmin'){
        res.render('tadmin/add/add_hotels', {
            title: 'Add Hotel',
            my_session : req.session
        });
    } else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});

// Add Hotel
router.post('/add_hotel', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.hotels SET ?";
    let data = {
        htl_name : req.body.hotel,
    };
    if (req.session.loggedin == true && req.session.role === 'TAdmin') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('error', 'Error, Try Again');
                res.redirect('/tour_admin/add_hotels');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/tour_admin/add_hotels');
            }
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});

/* ****************************************************************************** */
//  Make Reservation

router.get('/reserves', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'TAdmin') {
        res.render('tadmin/add/add_reservations', 
        { 
            title: 'Reservations', 
            my_session : req.session
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});


module.exports = router;