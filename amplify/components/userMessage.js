import React, { useState } from 'react';
import { API } from 'aws-amplify';

const UserManager = ({ tenantId }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const createUser = async () => {
    const mutation = `
      mutation CreateUser {
        createUser(input: { username: "${username}", email: "${email}", tenantId: "${tenantId}", role: "${role}" }) {
          id
        }
      }
    `;
    try {
      await API.graphql({ query: mutation });
      alert('User created successfully');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <div>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="User">User</option>
        <option value="TenantAdmin">TenantAdmin</option>
      </select>
      <button onClick={createUser}>Create User</button>
    </div>
  );
};

export default UserManager;
