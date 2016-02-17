var express = require('express');
var router = express.Router();
var sha1 = require('sha1');
var session = require('express-session');
require('../models/User');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var mongoose = require('mongoose');

var User = mongoose.model('User');

/* POST home page. */
router.post('/register', function(req, res, next) {
  var user = new User(req.body);
  user.password = sha1(req.body.password);
  user.save(function(err) {
    if (err) { return res.send(err); }

    res.json({ success: "Votre comptre est crée avec success." });
  });
});

router.post('/login', function(req, res) {

  var username = req.body.username;
  var password = sha1(req.body.password);

  User.find({username: username, password: password}, function(err, response) {
      if (response.length === 0) {
        return res.json({ error: 'Votre login ou mot de passe n\'est pas correct', status:'error' });
      }
      var token = jwt.sign({ username: response.username }, "jwtSecret");
      //var otherPro = 'blibli';
      user = response[0];
      user.token = token;
      user.save(function (err) {
          if(err) {
            return res.send(err);
          }
      });
      res.json(response[0]);
  });

});

router.post('/isLogged', function(req, res) {
    var token = req.body.token;

    User.find({token : token}, function(err, response) {
        if (err) { console.log("err" + err) }

        //console.log(response[0]);
        if(typeof response[0] === 'undefined') {
            return res.json({ error: 'Vous ete pas connecter' })
        }
        return res.send(response[0]);
    });
});


module.exports = router;
