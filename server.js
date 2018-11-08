const express = require('express');

const bodyParser = require('body-parser');
const {mongoose} = require('./database/connection');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const passport = require('passport');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());

//passport Config
require('./config/passport')(passport);

//Use routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port = process.env.PORT || 5000;

app.listen(port,()=>{
  console.log(`Server running on port ${port}`)
});
