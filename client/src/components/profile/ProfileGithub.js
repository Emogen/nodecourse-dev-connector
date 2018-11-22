import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ProfileGithub
 */
class ProfileGithub extends Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props){
    super(props);
    this.state = {
      clientId: 'ece0d90415386a441f42',
      clientSecret: '72d6087a64e18001179d6b6642e4d7f2fe614a4a',
      count: 5,
      sort: 'created: asc',
      repos: []
    }
  }
  componentDidMount(){
    const { username } = this.props;
    const {count,sort,clientId,clientSecret} = this.state;

    fetch(`https://api.github.com/users/${username}/repos?per_page=${count}&sort=${sort}&client_id=${clientId}&client_secret=${clientSecret}`)
      .then(res=> res.json())
      .then(data => {
        if(this.refs.myRef){
          this.setState({repos: data});
        }

      }).catch(err=>console.log(err));
  }
  render() {
    const { repos }= this.state;

    const repoItems = repos.map(repo=>(
      <div key={repo.id} className="card card-body mb-2">
        <div className="row">
          <div className="col-md-6">
            <h4>
              <a href={repo.html_url} className="text-info" target="_blank">
                {repo.name}
              </a>
            </h4>
            <p>{repo.description}</p>
          </div>
          <div className="col-md-6">
            <span className="badge badge-info mr-1">
              Stars: {repo.stargazers_count}
            </span>
            <span className="badge badge-secondary mr-1">
              Watchers: {repo.watchers_count}
            </span>
            <span className="badge badge-success">
              Forks: {repo.forks_count}
            </span>
          </div>
        </div>
      </div>
    ));
    return (
      <div ref="myRef">
        <hr />
        <h3 className="mb-4">Lates Github Repos</h3>
        {repoItems}
      </div>
    );
  }
}

ProfileGithub.propTypes = {
  username: PropTypes.string.isRequired
}

export default ProfileGithub;
