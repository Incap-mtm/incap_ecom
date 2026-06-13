import React from 'react';
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
export default function UserEdit({ adminUser, userGridUrl }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query UserEditQuery {\n    adminUser(id: getContextValue(\"adminUserId\", null)) {\n      adminUserId\n      uuid\n      email\n      fullName\n      status\n    }\n    userGridUrl: url(routeId: \"userGrid\")\n  }\n";
export {};
