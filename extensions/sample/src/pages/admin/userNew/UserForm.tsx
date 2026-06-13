import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';

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

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  marginBottom: 16
};

const labelStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 500,
  color: '#374151'
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: 6,
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

const errorBoxStyle: React.CSSProperties = {
  background: '#fef2f2',
  border: '1px solid #fca5a5',
  color: '#dc2626',
  borderRadius: 6,
  padding: '8px 12px',
  marginBottom: 16,
  fontSize: 14
};

const successBoxStyle: React.CSSProperties = {
  background: '#f0fdf4',
  border: '1px solid #86efac',
  color: '#16a34a',
  borderRadius: 6,
  padding: '8px 12px',
  marginBottom: 16,
  fontSize: 14
};

export default function UserForm({ user, userGridUrl }: Props) {
  const isEdit = !!user;

  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [active, setActive] = useState(isEdit ? !!user?.status : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validación básica en el cliente
    if (!fullName.trim()) {
      setError('El nombre completo es requerido.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('El email no tiene un formato válido.');
      return;
    }
    if (!isEdit && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (isEdit && password.length > 0 && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres (o dejá el campo vacío para no cambiarla).');
      return;
    }

    setLoading(true);

    try {
      const body: Record<string, unknown> = {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase()
      };
      if (!isEdit || password.length > 0) {
        body.password = password;
      }
      if (isEdit) {
        body.status = active;
      }

      const url = isEdit
        ? `/api/admin-users/${user!.adminUserId}`
        : '/api/admin-users';
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : data?.error?.message || 'Error al guardar el usuario.';
        setError(msg);
        return;
      }

      setSuccess(isEdit ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente. Redirigiendo...');

      setTimeout(() => {
        window.location.href = userGridUrl;
      }, 1200);
    } catch (e: any) {
      setError(e?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 540 }}>
      <CardHeader>
        <CardTitle>{isEdit ? 'Editar usuario' : 'Nuevo usuario'}</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div style={errorBoxStyle}>{error}</div>}
        {success && <div style={successBoxStyle}>{success}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="uf-full-name">Nombre completo</label>
            <input
              id="uf-full-name"
              type="text"
              style={inputStyle}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="uf-email">Email</label>
            <input
              id="uf-email"
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ejemplo.com"
              required
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="uf-password">
              Contraseña{isEdit ? ' (dejá vacío para no cambiar)' : ''}
            </label>
            <input
              id="uf-password"
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? '••••••••' : 'Mínimo 8 caracteres'}
              required={!isEdit}
              autoComplete="new-password"
            />
          </div>

          {isEdit && (
            <div style={{ ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <input
                id="uf-active"
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                style={{ width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="uf-active" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                Usuario activo
              </label>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
            <Button variant="outline" asChild>
              <a href={userGridUrl}>Cancelar</a>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
