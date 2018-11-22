import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getCurrentProfile,deleteAccount} from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import ProfileAction from './ProfileAction';
import Experience from './Experience';
import Education from './Education';
/**
 * Dashboard
 */
class Dashboard extends Component { // eslint-disable-line react/prefer-stateless-function
  componentDidMount(){
    this.props.getCurrentProfile();
  }

  onDeleteClick = (e) => {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if(profile === null || loading){
      dashboardContent = <Spinner />
    }else{
      //check if logged in user has profile database
      if(Object.keys(profile).length > 0){
        dashboardContent = (
          <div>
              <p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link> </p>
              <ProfileAction />
              <Experience experience={profile.experience}/>
              <Education education={profile.education}/>
            <div style={{ marginBitton : '60px'}} />
            <button type="button" onClick={this.onDeleteClick} className="btn btn-danger">Delete My Account</button>
          </div>
        );
      }else{
        //user is logged in but has no profiles
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name} </p>
            <p>You have not setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, {getCurrentProfile,deleteAccount})(Dashboard);
