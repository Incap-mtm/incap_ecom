import React from 'react';
import UserForm from './UserForm.js';

interface Props {
  userGridUrl: string;
}

export default function UserNew({ userGridUrl }: Props) {
  return <UserForm user={null} userGridUrl={userGridUrl} />;
}

export const layout = {
  areaId: 'content',
  sortOrder: 20
};

export const query = `
  query UserNewQuery {
    userGridUrl: url(routeId: "userGrid")
  }
`;
