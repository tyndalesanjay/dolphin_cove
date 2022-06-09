
var express = require('express');
var router = express.Router();
var conn = require('../lib/db')

/* GET Request Page. */
router.get('/', function(req, res, next) {
  conn.query('SELECT *, DATE(NOW()) AS request_date FROM dolphin_cove.programs', (err, results) => {
    if(err) {
      res.render('request', {title: 'Deals', req: ''})
    } else {
      res.render('request', {title: 'Deals', req: results})
    }
  });
});

// Post program Request
router.post('/reserve', (req,res) => {
  var data = {
    program_id : req.body.program,
    person_amount : req.body.amount,
    request_date: req.body.reqDate,
    scheduled_date: req.body.scheduled,
    scheduled_time: req.body.time
  }

  conn.query('INSERT INTO dolphin_cove.program_request SET ?', data, (err, results) => {
    if(err) {
      req.flash('error', err);
      res.redirect('/request');
    } else {
      req.flash('success', 'Your request was made!!');
      res.redirect('/request/complete_request');
    }
  });
});

// Get Finish request
router.get('/complete_request', (req, res) => {
  conn.query(`SELECT *, program_request.id AS request_id ,(programs.prog_price * program_request.person_amount) AS total FROM dolphin_cove.program_request, dolphin_cove.programs 
            WHERE program_request.program_id = programs.id
            ORDER BY program_request.id DESC
            LIMIT 1 ;`, (err, results) => {
    if(err) {
      console.log(err);
      req.flash('error', 'Please try making your request again');
      res.redirect('/request')
    } else {
      res.render('finish_request', {
        title: 'Finish Request',
        request: results[0]
      })
    }
  });
});

// Post to reservations
router.post('/reserve', (req, res) => {
  var data = {
    request_id : req.body.request_id,
    cust_fn : req.body.fname,
    cust_ln : req.body.lname,
    cust_email : req.body.email,
    hotel_id : req.body.hotel,
    reserve_type_id : req.body.reserve_type,
    payment_id : req.body.payment
  }

  conn.query('INSERT INTO dolphin_cove.reservations SET ?',data ,(err, results) => {
    if(err) {
      req.flash('error', 'Please Try Again');
      res.redirect('/request/complete_request');
    } else {
      req.flash('success', 'You Spot(s) has been Reserved!!');
      res.redirect('/request')
    }
  });
});


module.exports = router;
