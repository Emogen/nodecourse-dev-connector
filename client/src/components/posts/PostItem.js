import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import {Link} from 'react-router-dom';
import {deletePost, addLike, removeLike} from '../../actions/postActions';
/**
 * PostItem
 */
export class PostItem extends Component { // eslint-disable-line react/prefer-stateless-function
  onDelete = (id) => (e) => {
    this.props.deletePost(id);
  }
  onLikeClick = (id) => (e) => {
    this.props.addLike(id);
  }
  onUnLikeClick = (id) => (e) => {
    this.props.removeLike(id);
  }
  findUserLike(likes){
    const { auth } = this.props;

    if(likes.filter(like => like.user === auth.user.id).length > 0){
      return true
    }
    else{
      return false
    }
  }
  render() {
    const {post,auth,showAction} =this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="rounded-circle d-none d-md-block" src={post.avatar}
                alt="" />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showAction ? (<span>
              <button type="button" onClick={this.onLikeClick(post._id)} className="btn btn-light mr-1">
                <i className={classnames('fas fa-thumbs-up',{
                    'text-info': this.findUserLike(post.likes)
                  })}></i>
                <span className="badge badge-light">{post.likes.length}</span>
              </button>
              <button type="button" onClick={this.onUnLikeClick(post._id)} className="btn btn-light mr-1">
                <i className="text-secondary fas fa-thumbs-down"></i>
              </button>
              <Link to={`post/${post._id}`} className="btn btn-info mr-1">
                Comments
              </Link>
              {post.user === auth.user.id ? (<button onClick={this.onDelete(post._id)} className="btn btn-danger mr-1">
                <i className="fas fa-times" /></button>) : null}
            </span>) : null}
          </div>
        </div>
      </div>
    );
  }
}
PostItem.defaultProps = {
  showAction : true
}
PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps,{deletePost,addLike,removeLike})(PostItem);