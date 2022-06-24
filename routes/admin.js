var express = require('express');
var router = express.Router();
var conn =require('../lib/db')

/* GET home page. */
router.get('/', function(req, res, next) {
    if(req.session.loggedin === true && req.session.role === 'SAdmin'){
        conn.query(`SELECT  (SELECT COUNT(id) FROM admin) AS admin_amount, (SELECT COUNT(htl_name) FROM hotels) AS htl_amount, 
            (SELECT COUNT(tour_company) FROM tour_company) AS tour_amount,
            (SELECT COUNT(program_id) FROM program_request) AS request_amount`, (err, results) => {
            console.log(results)
            // conn.query('SELECT COUNT(id) AS htl_amount FROM hotels', (err, results) => {
            if(err) {
                req.flash('error', 'not working')
                res.render('super_admin/index', { 
                    title: 'Admin Portal', 
                    counters: '',
                    my_session : req.session
                });
            } else {
                res.render('super_admin/index', { 
                    title: 'Admin Portal', 
                    counters: results[0],
                    my_session : req.session
                });
            }
        });
    } else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

/**************************************************************** */
// Get View Employee

router.get('/view_employee', (req, res) => {
    
    let sql = 'SELECT *, ad.id AS admin_id FROM dolphin_cove.admin ad, dolphin_cove.role rle WHERE ad.role_id = rle.id ORDER BY ad.id'
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_employee',
                {
                    title: 'Employees',
                    employees: '',
                    my_session : req.session
                })
            }else {
                res.render('super_admin/admin_views/view_employee',
                {
                    title: 'Employees',
                    employees: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// GET ADD EMPLOYEE
router.get('/add_employee', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'SAdmin'){
        res.render('super_admin/add/add_employees', {
            title: 'Add Employee',
            my_session : req.session
        });
    } else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Add Employee
router.post('/add_employ', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.admin SET ?";
    let data = {
        admin_fn : req.body.fName,
        admin_ln : req.body.lName,
        username : req.body.username,
        password : req.body.password,
        role_id : req.body.role
    };
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('error', 'Error, Try Again');
                res.redirect('/admin/add_employee');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/admin/add_employee');
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Delete Employee
router.get('/delete/:id', (req, res) => {
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
        conn.query('DELETE FROM dolphin_cove.admin WHERE id=' + req.params.id, (err, results) => {
            if (err) {
                req.flash('error', 'Could Not Delete')
                res.redirect('/admin/view_employee')
            }else {
                req.flash('success', 'Employee Deleted')
                res.redirect('/admin/view_employee')
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

/* ***************************************************************************** */
// Get View Hotels

router.get('/view_hotels', (req, res) => {
    
    let sql = 'SELECT * FROM dolphin_cove.hotels ORDER BY id'
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_hotels',
                {
                    title: 'Hotels',
                    hotels: '',
                    my_session : req.session
                })
            }else {
                res.render('super_admin/admin_views/view_hotels',
                {
                    title: 'Hotels',
                    hotels: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});


// GET ADD Hotel
router.get('/add_hotel', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'SAdmin'){
        res.render('super_admin/add/add_hotels', {
            title: 'Add Hotel',
            my_session : req.session
        });
    } else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Add Hotel
router.post('/add_hotel', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.hotels SET ?";
    let data = {
        htl_name : req.body.hotel,
    };
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('error', 'Error, Try Again');
                res.redirect('/admin/add_hotel');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/admin/add_hotel');
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Delete Hotel
router.get('/delete/:id', (req, res) => {
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
        conn.query('DELETE FROM dolphin_cove.hotels WHERE id=' + req.params.id, (err, results) => {
            if (err) {
                req.flash('error', 'Could Not Delete')
                res.redirect('/admin/view_employee')
            }else {
                req.flash('success', 'Employee Deleted')
                res.redirect('/admin/view_employee')
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

/* ********************************************************************** */
// Get View Tours
router.get('/view_tour_company', (req, res) => {
    
    let sql = 'SELECT * FROM dolphin_cove.tour_company ORDER BY id'
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_tour_company',
                {
                    title: 'Tour Companies',
                    tours: '',
                    my_session : req.session
                })
            }else {
                res.render('super_admin/admin_views/view_tour_company',
                {
                    title: 'Tour Companies',
                    tours: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// GET Add Tour Company
router.get('/add_tour_company', (req, res) => {
    if(req.session.loggedin === true && req.session.role === 'SAdmin'){
        res.render('super_admin/add/add_tour_company', {
            title: 'Add Tour Company',
            my_session : req.session
        });
    } else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Add Tour Company
router.post('/add_tcompany', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.tour_company SET ?";
    let data = {
        tour_company : req.body.tComp,
    };
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
        conn.query(sql, data, (err, results) => {
            if(err) {
                req.flash('error', 'Error, Try Again');
                res.redirect('/admin/add_tour_company');
            }else {
                req.flash('success', 'Added Successfully');
                res.redirect('/admin/add_tour_company');
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

// Delete Hotel
router.get('/delete/:id', (req, res) => {
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
        conn.query('DELETE FROM dolphin_cove.tour_company WHERE id=' + req.params.id, (err, results) => {
            if (err) {
                req.flash('error', 'Could Not Delete')
                res.redirect('/admin/view_employee')
            }else {
                req.flash('success', 'Employee Deleted')
                res.redirect('/admin/view_employee')
            }
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

/* ***************************************************************** */
// View Reserve
router.get('/view_reservation', (req, res) => {
    
    let sql = `SELECT rs.id, rs.cust_fn, rs.cust_ln, rs.cust_email, pr.person_amount, pr.request_date, pr.scheduled_date, pr.scheduled_time, 
    rt.type, po.pymnt_type, rle.role, pg.prog_name, pg.prog_price, (pg.prog_price * pr.person_amount) AS total
    FROM dolphin_cove.reservations rs, dolphin_cove.program_request pr, dolphin_cove.reservation_type rt, 
    dolphin_cove.payment_options po, dolphin_cove.role rle, dolphin_cove.programs pg WHERE rs.request_id = pr.id 
    AND rs.reserve_type_id = rt.id AND rs.payment_id = po.id AND rs.placed_by = rle.id AND pr.program_id = pg.id ORDER BY rs.id`
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_reserves',
                {
                    title: 'Reservations',
                    reserves: '',
                    my_session : req.session,
                    
                });
            }else {
                res.render('super_admin/admin_views/view_reserves',
                {
                    title: 'Reservations',
                    reserves: results,
                    my_session : req.session
                });
            }
            console.log(results)
        });
    }else {
        req.flash('error', 'Not SuperAdmin')
        res.redirect('/login/dolphin_cove_login')
    }
});

/* ********************************************** */
// View Admin Reserves

router.get('/view_reserves', (req, res) => {
    
    let sql = `SELECT ar.id, ar.voucher, ar.cust_fn, ar.cust_ln, ar.person_amount, ar.scheduled_date, ar.scheduled_time, pg.prog_name, pg.prog_price, htl.htl_name, 
    po.pymnt_type, ta.admin_fn, ta.admin_ln, rle.role, (pg.prog_price * ar.person_amount) AS total
    FROM dolphin_cove.admin_reserves ar, dolphin_cove.programs pg, dolphin_cove.hotels htl, 
    dolphin_cove.payment_options po, dolphin_cove.admin ta, dolphin_cove.role rle
    WHERE ar.program_id = pg.id AND ar.hotel_id = htl.id AND ar.payment_id = po.id AND ar.placed_by = ta.id AND ta.role_id = rle.id`
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_treserves',
                {
                    title: 'Admin Reservations',
                    reserves: '',
                    my_session : req.session
                })
            }else {
                res.render('super_admin/admin_views/view_treserves',
                {
                    title: 'Admin Reservations',
                    reserves: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/dolphin_cove_login')
    }
});

//  Make Reservation
router.get('/add_reserves', (req, res) => {
    let sql = "SELECT LEFT(UUID(),8) as voucher, DATE(NOW()) AS request_date"
    if(req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if(err) { 
                res.render('super_admin/add/add_reservations', 
                { 
                    title: 'Reservations', 
                    data: '',
                    my_session : req.session
                });
            } else {
                res.render('super_admin/add/add_reservations', 
                { 
                    title: 'Reservations', 
                    data: results[0],
                    my_session : req.session
                });
            }
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/dolphin_cove_login')
    }
});


// Post tour Reservations

router.post('/make_reservations', (req, res) => {
    let sql = "INSERT INTO dolphin_cove.admin_reserves SET ?"
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

    if(req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, data, (err, results) => {
            if (err) {
                req.flash('error', 'Did Not Post');
                res.redirect('/admin/add_reserves');
            } else {
                req.flash('success', 'Made Post');
                res.redirect('/admin/add_reserves');
            }
        });
    }else {
        req.flash('error', 'Please Sign In')
        res.redirect('/login/dolphin_cove_login')
    }
});


/* ************************************************** */
// View Tour Reservations

router.get('/view_reserves', (req, res) => {
    
    let sql = `SELECT tr.id, tr.voucher, tr.cust_fn, tr.cust_ln, tr.person_amount, tr.scheduled_date, tr.scheduled_time, pg.prog_name, pg.prog_price, htl.htl_name, 
    po.pymnt_type, ta.tour_fn, ta.tour_ln, rle.role, tc.tour_company, (pg.prog_price * tr.person_amount) AS total
    FROM dolphin_cove.tour_reserves tr, dolphin_cove.programs pg, dolphin_cove.hotels htl, 
    dolphin_cove.payment_options po, dolphin_cove.tour_admin ta, dolphin_cove.role rle, dolphin_cove.tour_company tc
    WHERE tr.program_id = pg.id AND tr.hotel_id = htl.id AND tr.payment_id = po.id AND tr.placed_by = ta.id AND ta.role_id = rle.id AND ta.company_id = tc.id`
    if (req.session.loggedin === true && req.session.role === 'SAdmin') {
        conn.query(sql, (err, results) => {
            if (err) {
                res.render('super_admin/admin_views/view_treserves',
                {
                    title: 'Tour Reservations',
                    reserves: '',
                    my_session : req.session
                })
            }else {
                res.render('super_admin/admin_views/view_treserves',
                {
                    title: 'Tour Reservations',
                    reserves: results,
                    my_session : req.session
                })
            }
        });
    }else {
        req.flash('error', 'Please Sign in')
        res.redirect('/login/dolphin_cove_login')
    }
});


module.exports = router;