import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const Profile = ({ userProfile , baseUrl , token , isLogin  }) => {
  console.log(isLogin)
  return (
    <div>
      <h2>Profile </h2>
      <p>id: {userProfile.id}</p>
      <p>username: {userProfile.username}</p>
      <p>base url: {baseUrl}</p>
      <p>token: {token}</p>
      <Link to="/"> Dashboard</Link>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(Profile);