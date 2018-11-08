const mongoose = require('mongoose');

//DB Config
const db = require('./../config/keys').mongoURI;

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(()=>{
      console.log('MongoDB Connected')
    }).catch((err)=>{
      console.log(err);
    });


module.exports = {mongoose};
