import { Card, CardContent, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/common/ui/Table.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';
export default function UserGrid({ adminUsers, userNewUrl, userEditUrlTemplate }) {
    var _a;
    const [users, setUsers] = useState((_a = adminUsers === null || adminUsers === void 0 ? void 0 : adminUsers.items) !== null && _a !== void 0 ? _a : []);
    const [busy, setBusy] = useState(null);
    const [error, setError] = useState(null);
    const handleToggleStatus = async (user) => {
        setBusy(user.adminUserId);
        setError(null);
        try {
            const res = await fetch(`/api/admin-users/${user.adminUserId}`, {
                method: 'PATCH',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: !user.status })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                setError(data.error || 'Error al cambiar el estado.');
            }
            else {
                setUsers((prev) => prev.map((u) => u.adminUserId === user.adminUserId
                    ? { ...u, status: user.status ? 0 : 1 }
                    : u));
            }
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
        finally {
            setBusy(null);
        }
    };
    const handleDelete = async (user) => {
        if (!window.confirm(`¿Eliminar a ${user.fullName}? Esta acción no se puede deshacer.`))
            return;
        setBusy(user.adminUserId);
        setError(null);
        try {
            const res = await fetch(`/api/admin-users/${user.adminUserId}`, {
                method: 'DELETE',
                credentials: 'same-origin'
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || data.success === false) {
                setError(data.error || 'Error al eliminar el usuario.');
            }
            else {
                setUsers((prev) => prev.filter((u) => u.adminUserId !== user.adminUserId));
            }
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
        finally {
            setBusy(null);
        }
    };
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                React.createElement(CardTitle, null, "Usuarios admin"),
                React.createElement(Button, { asChild: true },
                    React.createElement("a", { href: userNewUrl }, "+ Nuevo usuario")))),
        React.createElement(CardContent, null,
            error && (React.createElement("div", { style: {
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    color: '#dc2626',
                    borderRadius: 6,
                    padding: '8px 12px',
                    marginBottom: 12,
                    fontSize: 14
                } }, error)),
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "Nombre"),
                        React.createElement(TableHead, null, "Email"),
                        React.createElement(TableHead, null, "Estado"),
                        React.createElement(TableHead, { style: { textAlign: 'right' } }, "Acciones"))),
                React.createElement(TableBody, null,
                    users.length === 0 && (React.createElement(TableRow, null,
                        React.createElement(TableCell, { colSpan: 4, style: { textAlign: 'center', color: '#64748b' } }, "No hay usuarios."))),
                    users.map((user) => (React.createElement(TableRow, { key: user.adminUserId },
                        React.createElement(TableCell, null, user.fullName),
                        React.createElement(TableCell, null, user.email),
                        React.createElement(TableCell, null,
                            React.createElement("span", { style: {
                                    display: 'inline-block',
                                    padding: '2px 10px',
                                    borderRadius: 9999,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    background: user.status ? '#dcfce7' : '#f1f5f9',
                                    color: user.status ? '#16a34a' : '#64748b'
                                } }, user.status ? 'Activo' : 'Inactivo')),
                        React.createElement(TableCell, { style: { textAlign: 'right' } },
                            React.createElement("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' } },
                                React.createElement(Button, { variant: "outline", asChild: true },
                                    React.createElement("a", { href: userEditUrlTemplate.replace('__ID__', String(user.adminUserId)) }, "Editar")),
                                React.createElement(Button, { variant: "outline", disabled: busy === user.adminUserId, onClick: () => handleToggleStatus(user) }, busy === user.adminUserId
                                    ? '...'
                                    : user.status
                                        ? 'Desactivar'
                                        : 'Activar'),
                                React.createElement(Button, { variant: "outline", disabled: busy === user.adminUserId, onClick: () => handleDelete(user), style: { color: '#dc2626', borderColor: '#fca5a5' } }, busy === user.adminUserId ? '...' : 'Eliminar')))))))))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 20
};
export const query = `
  query UserGridQuery {
    adminUsers(filters: [{ key: "limit", operation: eq, value: "500" }]) {
      items {
        adminUserId
        uuid
        email
        fullName
        status
      }
    }
    userNewUrl: url(routeId: "userNew")
    userEditUrlTemplate: url(routeId: "userEdit", params: [{ key: "id", value: "__ID__" }])
  }
`;
//# sourceMappingURL=UserGrid.js.map