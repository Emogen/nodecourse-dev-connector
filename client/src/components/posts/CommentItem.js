import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {deleteComment} from '../../actions/postActions';
/**
 * CommentItem
 */
export class CommentItem extends Component { // eslint-disable-line react/prefer-stateless-function
  const {comment,postId,auth} = this.props;

  render() {
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="rounded-circle d-none d-md-block" src={comment.avatar} alt="" />
            </a>
            <br />
            <p className="text-center">{comment.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{comment.text}</p>
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => {
  auth: state.auth
}

export default connect(mapStateToProps,{deleteComment})(CommentItem);
