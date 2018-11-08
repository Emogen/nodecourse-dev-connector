const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {User} = require('./../../models/User');
const {Profile} = require('./../../models/Profile');

const {validateProfileInput} = require('./../../validation/profile');
const {validateExperienceInput} = require('./../../validation/experience');
const {validateEducationInput} = require('./../../validation/education');

router.get('/test',(req,res)=>{
  res.json({
    message : "Profile Works"
  });

});

//@route GET api/Profile
//@desc Get current users profile
//@access Logged User

router.get('/',passport.authenticate('jwt',{session :false}),(req,res)=>{
  const errors = {};

  Profile.findOne({user: req.user.id})
        .populate('user',['name','avatar'])
        .then(profile => {
          if(!profile){
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
          }
          res.json(profile);
        }).catch(err=>res.status(404).json(err));
});

//@route GET api/profile/all
//@desc Get all profiles
//@access Public
router.get('/all',(req,res)=>{
  const errors = {};
  Profile.find()
    .populate('user',['name','avatar'])
    .then(profiles=>{
      if(!profiles){
        errors.noprofile = 'There are no profile';
        return res.status(404).json(errors);
      }
      res.json(profiles);
    }).catch(err => res.status(404).json({profile:'There is no profile for this user'}));;
});
//@route GET api/profile/handle/:handle
//@desc Get profile by handle
//@access Public

router.get('/handle/:handle',(req,res)=>{
  const errors = {};

  Profile.findOne({handle:req.params.handle})
    .populate('user',['name','avatar'])
    .then(profile=>{
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    }).catch(err => res.status(404).json(err));
});

//@route GET api/profile/user/:user_id
//@desc Get profile by user
//@access Public

router.get('/user/:user_id',(req,res)=>{
  const errors = {};

  Profile.findOne({user:req.params.user_id})
    .populate('user',['name','avatar'])
    .then(profile=>{
      if(!profile){
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    }).catch(err => res.status(404).json({profile:'There is no profile for this user'}));
});

//@route POST api/profile
//@desc Create or Update user profile
//@access Logged User

router.post('/',passport.authenticate('jwt',{session :false}),(req,res)=>{
  const {errors, isValid} = validateProfileInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  //Get fields
  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.status) profileFields.status = req.body.status;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  //skills - split into array
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');
  }
  //social
  profileFields.social = {};
  if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

  Profile.findOne({user: req.user.id})
          .then(profile=>{
            if(profile){
              //Update
              Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
              )
              .then(profile=>res.json(profile))
            }else{
              //Create
              // console.log(profileFields);
              //Check if handle Exist
              Profile.findOne({handle: profileFields.handle})
                  .then(queryHandle => {
                    if(queryHandle){
                      errors.handle = 'That Handle is already exist';
                      return res.status(400).json(errors);
                    }

                    //save Profile
                    return new Profile(profileFields).save().then(profile => res.json(profile));
                  }).catch(e=>console.log(e));
            }
          }).catch(e=>res.status(400).json({sys:'Unknown Error'}));
});

//@route POST api/profile/experience
//@desc Add Experience to profile
//@access Logged User

router.post('/experience',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const {errors, isValid} = validateExperienceInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile=>{
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experience.unshift(newExp);

      return profile.save().then(profile=>res.json(profile));
    }).catch((e)=>res.status(400).json({sys:'Unknown Error'}));
});

//@route POST api/profile/education
//@desc Add Education to profile
//@access Logged User

router.post('/education',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const {errors, isValid} = validateEducationInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user: req.user.id})
    .then(profile=>{
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.education.unshift(newEdu);

      return profile.save().then(profile=>res.json(profile));
    }).catch((e)=>res.status(400).json({sys:'Unknown Error'}));
});

//@route DELETE api/profile/experience/:experience_id
//@desc Delete experience from profile
//@access Logged User

router.delete('/experience/:experience_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const errors = {};
  Profile.findOne({user: req.user.id})
    .then(profile=>{

      //Get remove index
      const removeIndex = profile.experience
        .map((experience)=>experience.id)
        .indexOf(req.params.experience_id);
      //Splice out of array
      if(removeIndex<0){
        errors.experience = 'Experience not found'
        return res.status(404).json(errors);
      }
      profile.experience.splice(removeIndex,1);

      return profile.save().then(profile=>res.json(profile));
    }).catch((e)=>res.status(400).json({sys:'Unknown Error'}));
});

//@route DELETE api/profile/education/:education_id
//@desc Delete education from profile
//@access Logged User

router.delete('/education/:education_id',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const errors = {};
  Profile.findOne({user: req.user.id})
    .then(profile=>{

      //Get remove index
      const removeIndex = profile.education
        .map((education)=>education.id)
        .indexOf(req.params.education_id);
      //Splice out of array
      if(removeIndex<0){
        errors.education = 'Education not found'
        return res.status(404).json(errors);
      }
      profile.education.splice(removeIndex,1);

      return profile.save().then(profile=>res.json(profile));
    }).catch((e)=>res.status(400).json({sys:'Unknown Error'}));
});

//@route DELETE api/profile/
//@desc Delete user and profiles
//@access Logged User

router.delete('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
  const errors = {};
  Profile.findOneAndRemove({user: req.user.id})
        .then(()=>{
          User.findOneAndRemove({_id:req.user.id})
              .then(()=>res.json({success:true}));
        });
});

module.exports = router;
