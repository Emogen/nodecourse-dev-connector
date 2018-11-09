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

//@route POST api/posts/like/:post_id
//@desc Like post
//@access Logged User
router.post('/like/:post_id',passport.authenticate('jwt',{session: false}),(req,res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile => {
      return Post.findById(req.params.post_id)
        .then(post=>{
          if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({alreadyliked: 'User already liked this post'});
          }
          //add user id to likes array
          post.likes.unshift({ user: req.user.id });
          return post.save().then(post=>res.json(post)).catch(e=>Promise.reject());
        });
    }).catch(e=>res.status(404).json({postnotfound : "Post id not found"}));
});

//@route POST api/posts/unlike/:post_id
//@desc Unlike post
//@access Logged User
router.post('/unlike/:post_id',passport.authenticate('jwt',{session: false}),(req,res)=>{
  Profile.findOne({user: req.user.id})
    .then(profile => {
      return Post.findById(req.params.post_id)
        .then(post=>{
          if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({notliked: 'you have not yet liked this post'});
          }
          //add user id to likes array
          const removeIndex = post.likes
                  .map(item=>item.user.toString())
                  .indexOf(req.user.id);
          post.likes.splice(removeIndex,1);

          return post.save().then(post=>res.json(post)).catch(e=>Promise.reject());
        });
    }).catch(e=>res.status(404).json({postnotfound : "Post id not found"}));
});

//@route POST api/posts/comment/:post_id
//@desc Post comment to post
//@access Logged User
router.post('/comment/:post_id',passport.authenticate('jwt',{session: false}),(req,res)=>{
  const {errors, isValid} = validatePostInput(req.body);
  //check validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  Post.findById(req.params.post_id)
    .then(post=>{
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      }
      console.log(post.text);

      //Add to comments array
      post.comments.unshift(newComment);

      //save
      post.save().then(post=>res.json(post));

    // post.save().then(post=>res.json(post));
  }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
});

//@route DELETE api/posts/comment/:post_id/:comment_id
//@desc Remove comment from post
//@access Logged User
router.delete('/comment/:post_id/:comment_id',passport.authenticate('jwt',{session: false}),(req,res)=>{

  Post.findById(req.params.post_id)
    .then(post => {
    if(post.comments.filter(comment=> comment._id.toString() === req.params.comment_id).length === 0){
      return res.status(404).json({commentnotexist: 'Comment does not exist'});
    }
    //if the logged user is the owner of the post
    if(post.user.toString() !== req.user.id){
      var loggedUserComments = post.comments.filter(comment=> comment.user.toString() === req.user.id);
      //checking if i have the authority to delete the post
      if(loggedUserComments.length === 0 || loggedUserComments.filter(comment=>comment._id.toString() === req.params.comment_id).length === 0){
        return res.status(401).json({notauthorized: 'U are not authorized to delete this post'});
      }
    }
    //Ger remove indexOf
    const removeIndex = post.comments
        .map(item=>item._id.toString())
        .indexOf(req.params.comment_id);

    //Splice comment out of array
    post.comments.splice(removeIndex, 1);

    post.save().then(post=>res.json(post));
  }).catch(err => res.status(404).json({postnotfound: 'No Post Found'}));
});

module.exports = router;
