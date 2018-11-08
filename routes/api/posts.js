const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const {Post} = require('./../../models/Post');
const {Profile} = require('./../../models/Profile');

const {validatePostInput} = require('./../../validation/post');

router.get('/test',(req,res)=>{
  res.json({
    message : "Posts Works"
  });
});

//@route GET api/posts
//@desc Get posts
//@access Public
router.get('/',(req,res)=>{
  Post.find()
    .sort({date: -1})
    .then(posts=>res.json(posts))
    .catch(e=>res.status(404).json({nopostfound: 'no posts found'}));
});

//@route GET api/posts/:post_id
//@desc Get post by id
//@access Public
router.get('/:post_id',(req,res)=>{
  Post.findOne({_id:req.params.post_id})
    .sort({date: -1})
    .then(posts=>{
      if(!posts){
        return Promise.reject();
      }
      return res.json(posts)
    })
    .catch(e=>res.status(404).json({nopostfound: 'no post found with the id'}));
});

//@route POST api/posts
//@desc Create posts
//@access Logged User
router.post('/',passport.authenticate('jwt',{session: false}),(req,res)=>{
  const {errors, isValid} = validatePostInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save().then(post=>{res.json(post)});
});

//@route DELETE api/posts/:post_id
//@desc Delete post by id
//@access Logged User
router.delete('/:post_id',passport.authenticate('jwt',{session: false}),(req,res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile => {
      return Post.findById(req.params.post_id)
        .then(post=>{
          //Check for post owner
          if(post.user.toString() !== req.user.id){
            return res.status(401).json({notauthorized: 'User not authorized'});
          }
          return post.remove().then(()=>res.json({success:true}));
        });
    }).catch(e=>res.status(404).json({postnotfound : "Post id not found"}));
});
module.exports = router;
