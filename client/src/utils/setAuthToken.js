import axios from 'axios';

const setAuthToken = token => {
  console.log("F");
  if(token){
    //Apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  }
  else{
    //delete auth headers
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthToken;
