require('dotenv').config();
const User = require("../models/user");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var FacebookTokenStrategy = require('passport-facebook-token');
var passport = require('passport');
var config = require('../config')
const {check,validationResult} = require('express-validator');
exports.signup = (req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array()[0].msg });
  }
	const user = new User(req.body);
	user.save((err,user)=>{
           if(err){
           	   return res.status(400).json({
           	   	err:" not able to save user in db"
           	   });
           }
           res.json({
           	   name:user.name,
           	   email:user.email,
           	   id:user._id
           });
	});
};

exports.signin = (req,res)=>{
  const {email,password} = req.body;
   const errors = validationResult(req);
   if (!errors.isEmpty()) 
   {
     return res.status(422).json({ errors: errors.array()[0].msg });
   }
   User.findOne({email},(err,user)=>{
      if(err || !user){
          return  res.status(400).json({ err: "user is not registered"});
      }
      if(!user.autheticate(password)){
          return res.status(402).json({err:"email and password does not match"});   
      }
      //create token
      const token = jwt.sign({ _id: user._id }, process.env.SECRET);
      //put token in cookie
      res.cookie("token",token,{expire:new Date() +9000});

      //send response to front end
      const {name,_id,email,role} = user;
      return res.json({
        token,
        user: {name,_id,email,role}
      });
   });


};
exports.signout = (req,res)=>{
  res.clearCookie("token");
   res.json({
   	  message:"user signed out"
   });
};

//protected routs
exports.isSignedIn = expressJwt({
  secret:process.env.SECRET,
  userProperty:"auth"
});

//custom middlewares
exports.isAuthenticated =(req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id ==req.auth._id;
    if(!checker){
       return res.status(403).json({
           err:"access denied"
       });
    }
   next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    });
  }
  next();
};

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
    clientID: config.facebook.clientId,
    clientSecret: config.facebook.clientSecret
}, (acessToken,refreshToken,profile,done)=>{
    User.findOne({facebookId: profile.id},(err,user)=>{
       if(err){
         return done(err,false);
       }
       if(!err && user!==null){
         return done(null,user);
       }
       else {
          user = new User({name: profile.displayName});
          user.facebookId = profile.id;
          user.lastName = profile.name.familyName;
          user.save((err,user)=>{
              if(err) return done(err,false);
              else return done(null,user);
          });
       }
    })
    
}

));
