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
    if (req.session.loggedin == true && req.session.role === 'SAdmin') {
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


// dolphin_cove.tour_company
module.exports = router;