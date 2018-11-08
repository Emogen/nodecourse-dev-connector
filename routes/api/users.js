const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load input validation
const {validateRegisterInput} = require('./../../validation/register');
const {validateLoginInput} = require('./../../validation/login');

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
  const {errors, isValid} = validateRegisterInput(req.body);

  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  User.findOne({email: req.body.email})
      .then((user)=>{
        if(user){
          errors.email = 'Email Already Exist';
          return res.status(400).json(errors);
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
  const {errors, isValid} = validateLoginInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  //Find the user by Email
  User.findOne({email})
      .then(user =>{
        //check for users
        if(!user){
          errors.email = 'user email not found';
          return res.status(404).send({errors});
        }
        //Check password
        bcrypt.compare(password,user.password)
          .then(isMatch =>{
            if(!isMatch){
              errors.password = 'Password Incorrect';
              return res.status(400).json({errors})
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
