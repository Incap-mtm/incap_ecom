import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@components/common/ui/Table.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';

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

/**
 * Extrae un string del error de la API. La API puede devolver
 * { error: 'texto' } (nuestros handlers) o { error: { status, message } }
 * (errores no manejados / 500 de Evershop). Nunca devolver un objeto:
 * renderizar un objeto como hijo de React crashea el componente.
 */
function extractError(data: any, fallback: string): string {
  if (typeof data?.error === 'string') return data.error;
  if (typeof data?.error?.message === 'string') return data.error.message;
  return fallback;
}

export default function UserGrid({
  adminUsers,
  userNewUrl,
  userEditUrlTemplate
}: Props) {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers?.items ?? []);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleStatus = async (user: AdminUser) => {
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
        setError(extractError(data, 'Error al cambiar el estado.'));
      } else {
        setUsers((prev) =>
          prev.map((u) =>
            u.adminUserId === user.adminUserId
              ? { ...u, status: user.status ? 0 : 1 }
              : u
          )
        );
      }
    } catch (e: any) {
      setError(e?.message || 'Error de conexión.');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`¿Eliminar a ${user.fullName}? Esta acción no se puede deshacer.`)) return;
    setBusy(user.adminUserId);
    setError(null);
    try {
      const res = await fetch(`/api/admin-users/${user.adminUserId}`, {
        method: 'DELETE',
        credentials: 'same-origin'
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        setError(extractError(data, 'Error al eliminar el usuario.'));
      } else {
        setUsers((prev) => prev.filter((u) => u.adminUserId !== user.adminUserId));
      }
    } catch (e: any) {
      setError(e?.message || 'Error de conexión.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Usuarios admin</CardTitle>
          <Button asChild>
            <a href={userNewUrl}>+ Nuevo usuario</a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              color: '#dc2626',
              borderRadius: 6,
              padding: '8px 12px',
              marginBottom: 12,
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead style={{ textAlign: 'right' }}>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} style={{ textAlign: 'center', color: '#64748b' }}>
                  No hay usuarios.
                </TableCell>
              </TableRow>
            )}
            {users.map((user) => (
              <TableRow key={user.adminUserId}>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: 9999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: user.status ? '#dcfce7' : '#f1f5f9',
                      color: user.status ? '#16a34a' : '#64748b'
                    }}
                  >
                    {user.status ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <Button variant="outline" asChild>
                      <a
                        href={userEditUrlTemplate.replace(
                          '__ID__',
                          String(user.adminUserId)
                        )}
                      >
                        Editar
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy === user.adminUserId}
                      onClick={() => handleToggleStatus(user)}
                    >
                      {busy === user.adminUserId
                        ? '...'
                        : user.status
                        ? 'Desactivar'
                        : 'Activar'}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy === user.adminUserId}
                      onClick={() => handleDelete(user)}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      {busy === user.adminUserId ? '...' : 'Eliminar'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
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
