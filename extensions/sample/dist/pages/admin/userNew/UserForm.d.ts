import React from 'react';
interface AdminUser {
    adminUserId: number;
    email: string;
    fullName: string;
    status: number;
}
interface Props {
    /** Si se pasa user, estamos en modo edición. Sin user → modo alta. */
    user?: AdminUser | null;
    userGridUrl: string;
}
export default function UserForm({ user, userGridUrl }: Props): React.JSX.Element;
export {};
