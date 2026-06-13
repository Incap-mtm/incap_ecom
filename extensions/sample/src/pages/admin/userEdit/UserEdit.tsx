import React from 'react';
import UserForm from '../userNew/UserForm.js';

interface AdminUser {
  adminUserId: number;
  email: string;
  fullName: string;
  status: number;
}

interface Props {
  adminUser: AdminUser | null;
  userGridUrl: string;
}

export default function UserEdit({ adminUser, userGridUrl }: Props) {
  if (!adminUser) {
    return (
      <div style={{ padding: 24, color: '#64748b' }}>
        Usuario no encontrado.
      </div>
    );
  }

  return <UserForm user={adminUser} userGridUrl={userGridUrl} />;
}

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query UserEditQuery {
    adminUser(id: getContextValue("adminUserId", null)) {
      adminUserId
      uuid
      email
      fullName
      status
    }
    userGridUrl: url(routeId: "userGrid")
  }
`;
