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
// View Reservations

router.get('/view_reserves', (req, res) => {
    
    let sql = `SELECT tr.id, tr.voucher, tr.cust_fn, tr.cust_ln, tr.person_amount, tr.scheduled_date, tr.scheduled_time, pg.prog_name, pg.prog_price, htl.htl_name, 
    po.pymnt_type, ta.tour_fn, ta.tour_ln, rle.role, tc.tour_company, (pg.prog_price * tr.person_amount) AS total
    FROM dolphin_cove.tour_reserves tr, dolphin_cove.programs pg, dolphin_cove.hotels htl, 
    dolphin_cove.payment_options po, dolphin_cove.tour_admin ta, dolphin_cove.role rle, dolphin_cove.tour_company tc
    WHERE tr.program_id = pg.id AND tr.hotel_id = htl.id AND tr.payment_id = po.id AND tr.placed_by = ta.id AND ta.role_id = rle.id AND ta.company_id = tc.id`
    if (req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('tadmin/tadmin_views/view_reserves',
                {
                    title: 'Tour Reservations',
                    reserves: '',
                    my_session : req.session
                })
            }else {
                res.render('tadmin/tadmin_views/view_reserves',
                {
                    title: 'Tour Reservations',
                    reserves: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

//  Make Reservation
router.get('/add_reserves', (req, res) => {
    let sql = "SELECT LEFT(UUID(),8) as voucher, DATE(NOW()) AS request_date"
    if(req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query(sql, (err, results) => {
            if(err) { 
                res.render('tadmin/add/add_reservations', 
                { 
                    title: 'Reservations', 
                    data: '',
                    my_session : req.session
                });
            } else {
                res.render('tadmin/add/add_reservations', 
                { 
                    title: 'Reservations', 
                    data: results[0],
                    my_session : req.session
                });
            }
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});


// Post tour Reservations

router.post('/make_reservations', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.tour_reserves SET ?"
    let data = {
        program_id : req.body.program,
        requested_date : req.body.reqDate,
        scheduled_date : req.body.scheduled,
        scheduled_time : req.body.time,
        person_amount : req.body.amount,
        placed_by : req.body.role,
        voucher : req.body.voucher, 
        cust_fn : req.body.fname,
        cust_ln : req.body.lname,
        cust_email : req.body.email,
        hotel_id : req.body.hotel,
        payment_id : req.body.payment
    }

    if(req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query(sql, data, (err, results) => {
            if (err) {
                req.flash('error', 'Did Not Post');
                res.redirect('/tour_admin/add_reserves');
            } else {
                req.flash('success', 'Made Post');
                res.redirect('/tour_admin/add_reserves');
            }
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/tour_login')
    }
});

// View Invoices 

router.get('/view_invoice/:id', (req, res) => {
    
    if (req.session.loggedin === true && req.session.role === 'TAdmin') {
        conn.query('SELECT ar.id, ar.voucher, ar.cust_fn, ar.cust_ln, ar.person_amount, ar.scheduled_date, ar.scheduled_time, pg.prog_name, pg.prog_price, (pg.prog_price * ar.person_amount) AS total, po.pymnt_type FROM dolphin_cove.tour_reserves ar, dolphin_cove.programs pg, dolphin_cove.payment_options po WHERE ar.payment_id = po.id AND ar.program_id = pg.id AND ar.id =' + req.params.id, (err, results) => {
            if (err) {
                res.render('tadmin/tadmin_views/view_invoice',
                {
                    title: 'Invoices',
                    invoice: '',
                    my_session : req.session
                })
            }else {
                res.render('tadmin/tadmin_views/view_invoice',
                {
                    title: 'Invoices',
                    invoice: results[0],
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/tour_login')
    }
});

module.exports = router;