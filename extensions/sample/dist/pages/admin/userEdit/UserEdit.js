import React from 'react';
import UserForm from '../userNew/UserForm.js';
export default function UserEdit({ adminUser, userGridUrl }) {
    if (!adminUser) {
        return (React.createElement("div", { style: { padding: 24, color: '#64748b' } }, "Usuario no encontrado."));
    }
    return React.createElement(UserForm, { user: adminUser, userGridUrl: userGridUrl });
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
//# sourceMappingURL=UserEdit.js.map