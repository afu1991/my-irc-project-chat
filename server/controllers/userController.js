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

router.put('/edit', function(req, res) {

  /*var user = new User({
     username: req.body.username,
     email: req.body.email,
     password: req.body.password
  });*/
    User.findById(req.body._id, function (err, updated) {
       if (err) {
           console.log(err);
       }
       else {
          if(req.body.username) {
             /* var ok = User.findOne({ username: req.body.username }, function (err, user) {
                  console.log(user);
                  if ( user.length > 3) {
                      return res.json({ error: "Le login est deja existant. " });
                  }
              });*/
             updated.username = req.body.username;
          }
          if(req.body.email) {
              updated.email = req.body.email;
          }
          if(req.body.password) {
              updated.password = req.body.email;
          }
         // console.log(updated);
           updated.save(function (err, succ) {
               if(err) { console.log(err) }
               else {
                   console.log(succ);
                   return res.json( { success: "Votre profile à bien ete modifié.", datas: succ });
               }
           })
       }
    });

/*
  user.save(function(err) {
    if (err) {
      return res.send(err);
    }
    return res.json({ message: "Votre comptre est crée avec success." });
  });*/
});


module.exports = router;
