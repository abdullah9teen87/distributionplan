"use client";
import React from 'react';
import PropTypes from 'prop-types';

const UserList = ({ users }) => {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {/* {users.map((user) => (
          <li key={user.id}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Payment Status: {user.paymentStatus}</p>
          </li>
        ))} */}
      </ul>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      paymentStatus: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UserList;