var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    res.redirect('/users/room');
  }else{
    res.render('index', { title: 'Chat Room' });
  }
});

router.post('/room',function(req,res,next){
  res.send(req.body.userother);
})
router.get('/err',function(req,res,next){
  res.send('Sai');
})
router.get('/signup',function(req,res,next){
  res.render('signup',{title:'Chat room'});
})
router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
})
module.exports = router;
