import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import setAuthToken from './utils/setAuthToken'
import jwt_decode from 'jwt-decode';
import store from './store';

import PrivateRoute from './components/common/PrivateRoute';

import { setCurrentUser,logoutUser } from './actions/authAction';
import { clearProfile } from './actions/profileActions';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile/CreateProfile';

import './App.css';

//check for Token

if(localStorage.jwtToken){
  //set Auth token header auth
  setAuthToken(localStorage.jwtToken);

  //decode token and get user info
  const decoded = jwt_decode(localStorage.jwtToken);
  //Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  //check for expired Token

  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime){
    store.dispatch(logoutUser());
    store.dispatch(clearProfile());
    //redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={ Landing } />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
