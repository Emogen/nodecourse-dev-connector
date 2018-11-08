const Validator = require('validator');
const {isEmpty} = require('./is-empty');

var validatePostInput = (data) =>{
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text,{min: 10, max: 300})){
    errors.text = "Text Field must between 10 and 300 character"
  }

  if(Validator.isEmpty(data.text)){
    errors.text = "Text field is required"
  }



  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = {validatePostInput}
