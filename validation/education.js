const Validator = require('validator');
const {isEmpty} = require('./is-empty');

var validateEducationInput = (data) =>{
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';

  if(Validator.isEmpty(data.school)){
    errors.school = "Job title field is required"
  }
  if(Validator.isEmpty(data.degree)){
    errors.degree = "Company name field is required"
  }
  if(Validator.isEmpty(data.fieldofstudy)){
    errors.fieldofstudy = "From date field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = {validateEducationInput}
