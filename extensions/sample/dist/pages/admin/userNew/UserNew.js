import React from 'react';
import UserForm from './UserForm.js';
export default function UserNew({ userGridUrl }) {
    return React.createElement(UserForm, { user: null, userGridUrl: userGridUrl });
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
//# sourceMappingURL=UserNew.js.map