import { FileBrowser } from '@components/admin/FileBrowser.js';
import { Button } from '@components/common/ui/Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import uniqid from 'uniqid';
const AZUL = '#2A4899';
const VERDE = '#85C639';
export default function Media({ product }) {
    const control = useFormContext().control;
    // El orden del array `images` define la portada: el índice 0 es la principal
    // (el core guarda is_main = index === 0). Reordenar al frente = elegir portada.
    const { fields, append, remove, move, replace } = useFieldArray({
        name: 'images',
        control
    });
    const [openBrowser, setOpenBrowser] = useState(false);
    useEffect(() => {
        const images = (product === null || product === void 0 ? void 0 : product.image)
            ? [product.image].concat((product === null || product === void 0 ? void 0 : product.gallery) || [])
            : [];
        // Sembrar el field array una sola vez con las imágenes existentes
        replace(images);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleBrowserInsert = (fileUrl) => {
        // FileBrowser pasa la URL relativa, ej: /assets/products/Super-PVA/file.jpg
        const path = fileUrl.replace(/^\/?assets\//, '');
        append({ uuid: uniqid(), url: fileUrl, path });
        setOpenBrowser(false);
    };
    const images = fields;
    return (React.createElement(Card, { title: "Media" },
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Media"),
            React.createElement(CardDescription, null,
                "Gestion\u00E1 las im\u00E1genes del producto. Toc\u00E1",
                ' ',
                React.createElement("strong", null, "Hacer portada"),
                " en la imagen que quer\u00E9s como principal \u2014 la portada aparece destacada y es la que se ve en el cat\u00E1logo.")),
        React.createElement(CardContent, null,
            images.length === 0 ? (React.createElement("p", { style: { color: '#6b7280', fontSize: 14, margin: '8px 0 16px' } }, "Este producto no tiene im\u00E1genes. Agreg\u00E1 una desde el bot\u00F3n de abajo.")) : (React.createElement("div", { style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: 14
                } }, images.map((img, index) => {
                const isCover = index === 0;
                return (React.createElement("div", { key: img.uuid || img.url, style: {
                        position: 'relative',
                        border: `2px solid ${isCover ? VERDE : '#e2e8f0'}`,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: '#fff',
                        display: 'flex',
                        flexDirection: 'column'
                    } },
                    isCover && (React.createElement("span", { style: {
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 2,
                            background: VERDE,
                            color: '#181B1C',
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '3px 8px',
                            borderRadius: 6
                        } }, "\u2605 Portada")),
                    React.createElement("button", { type: "button", onClick: () => remove(index), title: "Eliminar imagen", style: {
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 2,
                            width: 24,
                            height: 24,
                            border: 'none',
                            borderRadius: '50%',
                            background: 'rgba(220,38,38,0.92)',
                            color: '#fff',
                            fontSize: 14,
                            lineHeight: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        } }, "\u00D7"),
                    React.createElement("div", { style: {
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 8,
                            background: '#f8fafc'
                        } },
                        React.createElement("img", { src: img.url, alt: "", style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' } })),
                    React.createElement("div", { style: { padding: 8 } }, isCover ? (React.createElement("span", { style: {
                            display: 'block',
                            textAlign: 'center',
                            fontSize: 11,
                            fontWeight: 700,
                            color: VERDE,
                            padding: '5px 0'
                        } }, "Imagen principal")) : (React.createElement("button", { type: "button", onClick: () => move(index, 0), style: {
                            width: '100%',
                            padding: '5px 8px',
                            fontSize: 12,
                            fontWeight: 700,
                            background: '#fff',
                            color: AZUL,
                            border: `1.5px solid ${AZUL}`,
                            borderRadius: 6,
                            cursor: 'pointer'
                        } }, "\u2605 Hacer portada")))));
            }))),
            React.createElement("div", { className: "mt-4", style: { marginTop: 16 } },
                React.createElement(Button, { variant: "outline", onClick: (e) => {
                        e.preventDefault();
                        setOpenBrowser(true);
                    } }, "Agregar imagen (subir o elegir del servidor)")),
            openBrowser && (React.createElement(FileBrowser, { isMultiple: false, onInsert: handleBrowserInsert, close: () => setOpenBrowser(false) })))));
}
export const layout = {
    areaId: 'leftSide',
    sortOrder: 15
};
export const query = `
  query Query {
    product(id: getContextValue("productId", null)) {
      image {
        uuid
        path
        url
      }
      gallery {
        uuid
        path
        url
      }
    }
  }
`;
//# sourceMappingURL=Media.js.map