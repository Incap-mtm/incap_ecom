import { Card, CardContent, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useState } from 'react';
const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 16
};
const labelStyle = {
    fontSize: 14,
    fontWeight: 500,
    color: '#374151'
};
const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 6,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
};
const errorBoxStyle = {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#dc2626',
    borderRadius: 6,
    padding: '8px 12px',
    marginBottom: 16,
    fontSize: 14
};
const successBoxStyle = {
    background: '#f0fdf4',
    border: '1px solid #86efac',
    color: '#16a34a',
    borderRadius: 6,
    padding: '8px 12px',
    marginBottom: 16,
    fontSize: 14
};
export default function UserForm({ user, userGridUrl }) {
    var _a, _b;
    const isEdit = !!user;
    const [fullName, setFullName] = useState((_a = user === null || user === void 0 ? void 0 : user.fullName) !== null && _a !== void 0 ? _a : '');
    const [email, setEmail] = useState((_b = user === null || user === void 0 ? void 0 : user.email) !== null && _b !== void 0 ? _b : '');
    const [password, setPassword] = useState('');
    const [active, setActive] = useState(isEdit ? !!(user === null || user === void 0 ? void 0 : user.status) : true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const handleSubmit = async (e) => {
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
            const body = {
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
                ? `/api/admin-users/${user.adminUserId}`
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
                setError(data.error || 'Error al guardar el usuario.');
                return;
            }
            setSuccess(isEdit ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente. Redirigiendo...');
            setTimeout(() => {
                window.location.href = userGridUrl;
            }, 1200);
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || 'Error de conexión.');
        }
        finally {
            setLoading(false);
        }
    };
    return (React.createElement(Card, { style: { maxWidth: 540 } },
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, isEdit ? 'Editar usuario' : 'Nuevo usuario')),
        React.createElement(CardContent, null,
            error && React.createElement("div", { style: errorBoxStyle }, error),
            success && React.createElement("div", { style: successBoxStyle }, success),
            React.createElement("form", { onSubmit: handleSubmit, noValidate: true },
                React.createElement("div", { style: fieldStyle },
                    React.createElement("label", { style: labelStyle, htmlFor: "uf-full-name" }, "Nombre completo"),
                    React.createElement("input", { id: "uf-full-name", type: "text", style: inputStyle, value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "Ej: Juan P\u00E9rez", required: true })),
                React.createElement("div", { style: fieldStyle },
                    React.createElement("label", { style: labelStyle, htmlFor: "uf-email" }, "Email"),
                    React.createElement("input", { id: "uf-email", type: "email", style: inputStyle, value: email, onChange: (e) => setEmail(e.target.value), placeholder: "admin@ejemplo.com", required: true })),
                React.createElement("div", { style: fieldStyle },
                    React.createElement("label", { style: labelStyle, htmlFor: "uf-password" },
                        "Contrase\u00F1a",
                        isEdit ? ' (dejá vacío para no cambiar)' : ''),
                    React.createElement("input", { id: "uf-password", type: "password", style: inputStyle, value: password, onChange: (e) => setPassword(e.target.value), placeholder: isEdit ? '••••••••' : 'Mínimo 8 caracteres', required: !isEdit, autoComplete: "new-password" })),
                isEdit && (React.createElement("div", { style: { ...fieldStyle, flexDirection: 'row', alignItems: 'center', gap: 10 } },
                    React.createElement("input", { id: "uf-active", type: "checkbox", checked: active, onChange: (e) => setActive(e.target.checked), style: { width: 16, height: 16, cursor: 'pointer' } }),
                    React.createElement("label", { htmlFor: "uf-active", style: { ...labelStyle, marginBottom: 0, cursor: 'pointer' } }, "Usuario activo"))),
                React.createElement("div", { style: { display: 'flex', gap: 8, marginTop: 8 } },
                    React.createElement(Button, { type: "submit", disabled: loading }, loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear usuario'),
                    React.createElement(Button, { variant: "outline", asChild: true },
                        React.createElement("a", { href: userGridUrl }, "Cancelar")))))));
}
//# sourceMappingURL=UserForm.js.map