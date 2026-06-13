import React from 'react';
interface AdminUser {
    adminUserId: number;
    uuid: string;
    email: string;
    fullName: string;
    status: number;
}
interface Props {
    adminUsers: {
        items: AdminUser[];
    };
    userNewUrl: string;
    userEditUrlTemplate: string;
}
export default function UserGrid({ adminUsers, userNewUrl, userEditUrlTemplate }: Props): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query UserGridQuery {\n    adminUsers(filters: [{ key: \"limit\", operation: eq, value: \"500\" }]) {\n      items {\n        adminUserId\n        uuid\n        email\n        fullName\n        status\n      }\n    }\n    userNewUrl: url(routeId: \"userNew\")\n    userEditUrlTemplate: url(routeId: \"userEdit\", params: [{ key: \"id\", value: \"__ID__\" }])\n  }\n";
export {};
