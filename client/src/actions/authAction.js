import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import {GET_ERRORS,SET_CURRENT_USER} from './types';
import jwt_decode from 'jwt-decode';

//Register user

export const registerUser = (userData, history) => dispatch => {
  axios.post('api/users/register',userData)
    .then(res=>history.push('/login'))
    .catch(err=>
      dispatch({
        type:GET_ERRORS,
        payload: err.response.data
      })
    );
}


//Login user
export const loginUser = (userData) => dispatch => {
  axios.post('/api/users/login',userData)
    .then(res=>{
      //save to localStorage
      const {token} = res.data;
      //set Token to ls
      localStorage.setItem('jwtToken',token);
      //Set token to auth header
      setAuthToken(token);

      //decode token to get user data
      const decoded = jwt_decode(token);
      //Set Current user
      dispatch(setCurrentUser(decoded))

    }).catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    }))
}

//set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

//Log out users
export const logoutUser = () => dispatch => {
  //remove token from localStorage
  localStorage.removeItem('jwtToken');
  //remove auth header for future requests
  setAuthToken(false);
  //set current user to { which will set isAuthenticated to false}
  dispatch(setCurrentUser({}));

  // history.push('/')
}
