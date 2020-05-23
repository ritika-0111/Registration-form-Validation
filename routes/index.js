var express = require('express');
var router = express.Router();
var db = require('./db');
var user = require('./func');

var bodyParser = require('body-parser');

router.get('/' , function(req, res, next) {
    res.render('registration');
  });


router.post('/avail', (req, res, next) => {
    console.log(req.body.username);
    var username = req.body.username;
    var sql = 'SELECT * FROM user WHERE username = ?';
    db.query(sql,username, (err, user, result) => {
        if (err) throw err;
        else {
         if (user.length > 0) {
          console.log(false);
          res.send(false);
         }
         else {
          console.log(true);
          res.send(true);
         }
        }
       });
   });

   
module.exports = router;

