const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
//Load user model
const {User} = require('./../../models/User');
const keys = require('./../../config/keys');

router.get('/test',(req,res)=>{
  res.json({
    message : "Users Works"
  });
});

//@route POST api/users/register
//@desc Register users//
//@access Public

router.post('/register',(req,res)=>{
  User.findOne({email: req.body.email})
      .then((user)=>{
        if(user){
          return res.status(400).json({email:"Email already exist"});
        }
        const avatar = gravatar.url(req.body.email,{
          s: '200', //Size
          r: 'pg', //rating
          d: 'mm' //default
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password:req.body.password
        });

        bcrypt.genSalt(10,(err, salt)=>{
          bcrypt.hash(newUser.password, salt, (err, hash)=>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(user => res.json(user))
                .catch((err)=> res.status(400).json({}))
          })
        });
      }).catch((e)=>res.status(400).json({}));
});

//@route POST api/users/login
//@desc Login User / Returning JWT token
//@access Public

router.post('/login',(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;

  //Find the user by Email
  User.findOne({email})
      .then(user =>{
        //check for users
        if(!user){
          return res.status(404).send({email: 'user email not found'});
        }
        //Check password
        bcrypt.compare(password,user.password)
          .then(isMatch =>{
            if(!isMatch){
              return res.status(400).json({password: 'Password Incorrect'})
            }
            //user matched
            const payload = {
              id: user.id,
              name: user.name,
              avatar: user.avatar
            }

            jwt.sign(payload,keys.secretOrKey, { expiresIn: 3600},(err,token)=>{
              res.json({
                success: true,
                token: 'Bearer '+token
              });
            });
          });
      }).catch((e)=>{
          return res.status(400).json({sys: 'Unknown Error'})
      });;
});

//@route GET api/users/current
//@desc Return current user
//@access Logged User

router.get('/current',passport.authenticate('jwt',{session: false}),(req,res)=>{
  res.json({
    id:req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

module.exports= router;
