var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose=require('mongoose');
const bcrypt = require('bcrypt');

var User=require('../model/user');
module.exports=function(passport){
    passport.use(new LocalStrategy({usernameField:'username',passwordField:'pass'},function(username,pass,done){
        User.findOne({username:username},function(err,user){
            console.log(user);
            if(err)
            {
                return done(err);
            }
            if(!user){
                return done(null,false,{message:'Sai tên rồi'});
            }
            // bcrypt.compare(pass,user.password,function(err,result){
            //     if(err) console.log(err);
            //     if(result){
            //         return done(null,user);
            //     }else{
            //         return done(null,false,{message:'Sai mật khẩu'});
            //     }
            // });
            if(pass!=user.password){
                return done(null,false,{message:'Sai mat khau'});
            }
            return done(null,user);
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
        passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}