import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';
/**
 * ProfileHeader
 */
class ProfileHeader extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {profile} = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-info text-white mb-3">
            <div className="row">
              <div className="col-4 col-md-3 m-auto">
                <img className="rounded-circle" src={profile.user.avatar} alt="" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="display-4 text-center">{profile.user.name}</h1>
              <p className="lead text-center">{profile.status} {isEmpty(profile.company) ? null : (<span>at {profile.company}</span>)}</p>
              <p>{isEmpty(profile.location) ? null : (<span>{profile.location}</span>)}</p>
              <p>
                {isEmpty(profile.website) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.website}>
                    <i className="fas fa-globe fa-2x"></i>
                  </a>
                )}

                {isEmpty(profile.social && profile.social.twitter) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.social.twitter}>
                    <i className="fab fa-twitter fa-2x"></i>
                  </a>
                )}

                {isEmpty(profile.social && profile.social.facebook) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.social.facebook}>
                    <i className="fab fa-facebook fa-2x"></i>
                  </a>
                )}
                {isEmpty(profile.social && profile.social.linkedin) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.social.linkedin}>
                    <i className="fab fa-linkedin fa-2x"></i>
                  </a>
                )}

                {isEmpty(profile.social && profile.social.instagram) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.social.instagram}>
                    <i className="fab fa-instagram fa-2x"></i>
                  </a>
                )}
                {isEmpty(profile.social && profile.social.youtube) ? null : (
                  <a className="text-white p-2" target="_blank" href={profile.social.youtube}>
                    <i className="fab fa-youtube fa-2x"></i>
                  </a>
                )}

              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileHeader.propTypes = {

}

export default ProfileHeader;
