var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

require('../models/User');

var User = mongoose.model('User');

/* GET users listing. */
/*router.get('/register', function(req, res, next) {
  //console.log(User);


//  console.log(next)
//  res.send('salut l\'amie');
   res.json({"ok":"salut l\'amie"});
});
*/
router.get('/test', function(req, res){
  res.render('index');

});

router.post('/register', function(req, res) {

  var user = new User({
     username: req.body.username,
     email: req.body.email,
     password: req.body.password
  });

  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
    return res.json({ message: "Votre comptre est crée avec success." });
  });
});

module.exports = router;
