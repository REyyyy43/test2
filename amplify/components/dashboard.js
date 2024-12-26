import React from 'react';
import Messages from './Messages';
import UserManager from './UserManager';

const Dashboard = ({ user }) => {
  const { attributes } = user;
  const role = attributes['custom:role'];
  const tenantId = attributes['custom:tenantId'];

  return (
    <div>
      {role === 'Admin' && <UserManager tenantId={tenantId} />}
      {role === 'TenantAdmin' && (
        <>
          <UserManager tenantId={tenantId} />
          <Messages tenantId={tenantId} />
        </>
      )}
      {role === 'User' && <Messages tenantId={tenantId} />}
    </div>
  );
};

export default Dashboard;
