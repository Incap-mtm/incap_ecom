import React from 'react';
export default function WhatsAppFloat({ setting }) {
    var _a;
    const number = (_a = setting === null || setting === void 0 ? void 0 : setting.storeWhatsappNumber) !== null && _a !== void 0 ? _a : '573002171521';
    const href = `https://api.whatsapp.com/send?phone=+${number}&text=Quiero%20m%C3%A1s%20informaci%C3%B3n`;
    return (React.createElement("a", { href: href, target: "_blank", rel: "noopener noreferrer", "aria-label": "Contactar por WhatsApp", style: {
            position: 'fixed',
            bottom: '24px',
            right: '92px',
            zIndex: 99,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37,211,102,0.45)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }, onMouseEnter: (e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(37,211,102,0.6)';
        }, onMouseLeave: (e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.45)';
        } },
        React.createElement("svg", { width: "30", height: "30", viewBox: "0 0 24 24", fill: "#fff", "aria-hidden": "true" },
            React.createElement("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.448h.005c6.585 0 11.946-5.359 11.949-11.893a11.821 11.821 0 00-3.48-8.413z" }))));
}
export const layout = {
    areaId: 'content',
    sortOrder: 999
};
export const query = `query { setting { storeWhatsappNumber } }`;
