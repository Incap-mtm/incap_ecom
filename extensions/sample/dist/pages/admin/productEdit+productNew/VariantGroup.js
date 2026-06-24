/**
 * Override del bloque de variantes del core.
 * Agrega un botón "Desvincular" por fila que llama a
 * DELETE /api/variants/:id con FormData (multipart/form-data),
 * que es el formato que acepta el companion del core
 * [context]multerNone[auth].js → multer().none().
 *
 * Reemplaza:
 *   node_modules/@evershop/evershop/dist/modules/catalog/pages/admin/productEdit/VariantGroup.js
 * Por mismo basename + carpeta productEdit+productNew.
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@components/common/ui/Table.js';
import React, { useState } from 'react';
import { useQuery } from 'urql';
// ---------------------------------------------------------------------------
// Query — misma que Variants.js del core
// ---------------------------------------------------------------------------
const VariantQuery = `
query Query($productId: ID!) {
  product(id: $productId) {
    variantGroup {
      items {
        id
        attributes {
          attributeId
          attributeCode
          optionId
          optionText
        }
        product {
          productId
          uuid
          name
          sku
          qty
          status
          urlKey
          visibility
          price {
            regular {
              value
              currency
              text
            }
          }
          inventory {
            qty
            isInStock
            stockAvailability
            manageStock
          }
          editUrl
          updateApi
          image {
            uuid
            url
          }
          gallery {
            uuid
            url
          }
        }
      }
    }
  }
}
`;
function VariantRow({ variant, variantGroup, refresh }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const [unlinking, setUnlinking] = useState(false);
    const [rowError, setRowError] = useState('');
    const handleUnlink = async () => {
        var _a;
        const confirmed = window.confirm('¿Desvincular esta variante del grupo? El producto no se borra; deja de ser una variante.');
        if (!confirmed)
            return;
        setUnlinking(true);
        setRowError('');
        try {
            // Usamos nuestro endpoint propio con JSON (no el del core, que hace
            // SET visibility = NULL — incompatible con la columna NOT NULL de esta DB).
            const res = await fetch('/api/unlink-variant', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: variant.product.productId })
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || (data === null || data === void 0 ? void 0 : data.error)) {
                // Extraer string robusto — nunca pasar objeto a React
                const msg = typeof (data === null || data === void 0 ? void 0 : data.error) === 'string'
                    ? data.error
                    : ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) ||
                        'No se pudo desvincular.';
                setRowError(msg);
                setUnlinking(false);
                return;
            }
            // Éxito: refrescar tabla para que la fila desaparezca
            refresh();
        }
        catch (e) {
            const msg = e instanceof Error ? e.message : 'Error de conexión.';
            setRowError(msg);
            setUnlinking(false);
        }
    };
    const img = (_b = (_a = variant.product) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.url;
    return (React.createElement(TableRow, null,
        React.createElement(TableCell, null, img ? (React.createElement("img", { src: img, alt: "", style: { maxWidth: '50px', height: 'auto', borderRadius: '4px' } })) : (React.createElement("div", { style: {
                width: '50px',
                height: '50px',
                background: '#e5e7eb',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#9ca3af'
            } }, "Sin img"))),
        variantGroup.attributes.map((a) => {
            const option = variant.attributes.find((attr) => attr.attributeCode === a.attributeCode);
            return (React.createElement(TableCell, { key: a.attributeId },
                React.createElement("label", null, (option === null || option === void 0 ? void 0 : option.optionText) || '--')));
        }),
        React.createElement(TableCell, null,
            React.createElement(Button, { variant: "link", className: "hover:cursor-pointer", onClick: (e) => {
                    e.preventDefault();
                    window.location.href = variant.product.editUrl;
                } }, (_c = variant.product) === null || _c === void 0 ? void 0 : _c.sku)),
        React.createElement(TableCell, null, (_f = (_e = (_d = variant.product) === null || _d === void 0 ? void 0 : _d.price) === null || _e === void 0 ? void 0 : _e.regular) === null || _f === void 0 ? void 0 : _f.text),
        React.createElement(TableCell, null, (_h = (_g = variant.product) === null || _g === void 0 ? void 0 : _g.inventory) === null || _h === void 0 ? void 0 : _h.qty),
        React.createElement(TableCell, null, ((_j = variant.product) === null || _j === void 0 ? void 0 : _j.status) === 1 ? (React.createElement("span", { style: { color: '#16a34a', fontWeight: 500 } }, "Activo")) : (React.createElement("span", { style: { color: '#dc2626', fontWeight: 500 } }, "Inactivo"))),
        React.createElement(TableCell, null,
            React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                React.createElement(Button, { variant: "outline", onClick: (e) => {
                        e.preventDefault();
                        window.location.href = variant.product.editUrl;
                    } }, "Editar"),
                React.createElement(Button, { variant: "outline", onClick: (e) => {
                        e.preventDefault();
                        handleUnlink();
                    }, disabled: unlinking, style: { color: '#dc2626', borderColor: '#dc2626' } }, unlinking ? 'Desvinculando…' : 'Desvincular'),
                rowError && (React.createElement("p", { style: { fontSize: '11px', color: '#dc2626', margin: 0 } }, rowError))))));
}
function VariantsTable({ productId, variantGroup }) {
    var _a, _b, _c;
    const [result, reexecuteQuery] = useQuery({
        query: VariantQuery,
        variables: { productId }
    });
    const refresh = () => {
        reexecuteQuery({ requestPolicy: 'network-only' });
    };
    const { data, fetching, error } = result;
    if (fetching) {
        return (React.createElement(CardContent, null,
            React.createElement("p", { style: { color: '#6b7280', padding: '8px' } }, "Cargando variantes\u2026")));
    }
    if (error) {
        return (React.createElement(CardContent, null,
            React.createElement("p", { style: { color: '#dc2626' } }, error.message)));
    }
    const items = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.product) === null || _a === void 0 ? void 0 : _a.variantGroup) === null || _b === void 0 ? void 0 : _b.items) !== null && _c !== void 0 ? _c : [];
    // Excluir el producto actual (mismo patrón que el core)
    const otherVariants = items.filter((v) => v.product.productId !== productId);
    if (otherVariants.length === 0) {
        return (React.createElement(CardContent, null,
            React.createElement("p", { style: { color: '#6b7280', fontSize: '14px' } }, "Sin otras variantes en este grupo.")));
    }
    return (React.createElement(CardContent, null,
        React.createElement("div", { className: "variant-list overflow-x-scroll" },
            React.createElement(Table, null,
                React.createElement(TableHeader, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableHead, null, "Imagen"),
                        variantGroup.attributes.map((a) => (React.createElement(TableHead, { key: a.attributeId }, a.attributeName))),
                        React.createElement(TableHead, null, "SKU"),
                        React.createElement(TableHead, null, "Precio"),
                        React.createElement(TableHead, null, "Stock"),
                        React.createElement(TableHead, null, "Estado"),
                        React.createElement(TableHead, null, "Acciones"))),
                React.createElement(TableBody, null, otherVariants.map((v) => (React.createElement(VariantRow, { key: v.id, variant: v, variantGroup: variantGroup, refresh: refresh }))))))));
}
const VariantGroup = ({ product }) => {
    var _a;
    const group = (_a = product === null || product === void 0 ? void 0 : product.variantGroup) !== null && _a !== void 0 ? _a : null;
    return (React.createElement(Card, null,
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Grupo de variantes"),
            React.createElement(CardDescription, null, "Gestion\u00E1 las variantes de este producto. Us\u00E1 \"Desvincular\" para separar un producto del grupo sin borrarlo.")),
        !group && (React.createElement(CardContent, null,
            React.createElement("p", { style: { color: '#6b7280', fontSize: '14px' } }, "Este producto no pertenece a un grupo de variantes."))),
        group && (React.createElement(VariantsTable, { productId: product.productId, variantGroup: group }))));
};
export const layout = {
    areaId: 'leftSide',
    sortOrder: 70
};
export const query = `
query Query {
  product(id: getContextValue('productId', null)) {
    productId
    uuid
    variantGroup {
      variantGroupId
      attributes: variantAttributes {
        attributeId
        attributeCode
        attributeName
        options {
          optionId
          optionText
        }
      }
      addItemApi
    }
  }
  createVariantGroupApi: url(routeId: "createVariantGroup")
  createProductApi: url(routeId: "createProduct")
}
`;
export default VariantGroup;
//# sourceMappingURL=VariantGroup.js.map