/**
 * Override del bloque de variantes del core.
 * Agrega un botón "Desvincular" por fila que llama a
 * POST /api/unlink-variant con JSON { productId }.
 * (Endpoint propio de la extensión: el del core hace
 * SET visibility = NULL y acá esa columna es NOT NULL → 500.)
 *
 * Reemplaza (mismo key `productEdit/VariantGroup`):
 *   node_modules/@evershop/evershop/dist/modules/catalog/pages/admin/productEdit/VariantGroup.js
 *
 * ⚠️ Este archivo DEBE vivir en la carpeta `productEdit/` (NO en
 * `productEdit+productNew/`). El override admin se resuelve por
 * `<carpeta>/<Componente>`: si estuviera en `productEdit+productNew/` la key sería
 * distinta a la del core (`productEdit/VariantGroup`) → NO overridea → se
 * renderizan DOS bloques de variantes (el del core + este). Los grupos de
 * variantes solo existen para productos ya creados, así que `productEdit/` es
 * el lugar correcto (productNew no aplica).
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import { Button } from '@components/common/ui/Button.js';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@components/common/ui/Table.js';
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

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
interface VariantAttribute {
  attributeId: string;
  attributeCode: string;
  optionId: string;
  optionText: string;
}

interface VariantGroupAttribute {
  attributeId: string;
  attributeCode: string;
  attributeName: string;
  options: { optionId: string; optionText: string }[];
}

interface VariantProduct {
  productId: number;
  uuid: string;
  name: string;
  sku: string;
  qty: number;
  status: number;
  urlKey: string;
  visibility: string | null;
  price: { regular: { value: number; currency: string; text: string } };
  inventory: { qty: number; isInStock: boolean; stockAvailability: string; manageStock: boolean };
  editUrl: string;
  updateApi: string;
  image: { uuid: string; url: string } | null;
  gallery: { uuid: string; url: string }[];
}

interface VariantItem {
  id: string;
  attributes: VariantAttribute[];
  product: VariantProduct;
}

interface VGroup {
  variantGroupId: string;
  attributes: VariantGroupAttribute[];
  addItemApi: string;
}

interface ProductProps {
  productId: number;
  uuid: string;
  variantGroup: VGroup | null;
}

// ---------------------------------------------------------------------------
// Fila individual con botón Desvincular
// ---------------------------------------------------------------------------
interface VariantRowProps {
  variant: VariantItem;
  variantGroup: VGroup;
  refresh: () => void;
}

function VariantRow({ variant, variantGroup, refresh }: VariantRowProps) {
  const [unlinking, setUnlinking] = useState(false);
  const [rowError, setRowError] = useState<string>('');

  const handleUnlink = async () => {
    const confirmed = window.confirm(
      '¿Desvincular esta variante del grupo? El producto no se borra; deja de ser una variante.'
    );
    if (!confirmed) return;

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

      if (!res.ok || data?.error) {
        // Extraer string robusto — nunca pasar objeto a React
        const msg =
          typeof data?.error === 'string'
            ? data.error
            : (data?.error?.message as string | undefined) ||
              'No se pudo desvincular.';
        setRowError(msg);
        setUnlinking(false);
        return;
      }

      // Éxito: refrescar tabla para que la fila desaparezca
      refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error de conexión.';
      setRowError(msg);
      setUnlinking(false);
    }
  };

  const img = variant.product?.image?.url;

  return (
    <TableRow>
      {/* Imagen */}
      <TableCell>
        {img ? (
          <img
            src={img}
            alt=""
            style={{ maxWidth: '50px', height: 'auto', borderRadius: '4px' }}
          />
        ) : (
          <div
            style={{
              width: '50px',
              height: '50px',
              background: '#e5e7eb',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#9ca3af'
            }}
          >
            Sin img
          </div>
        )}
      </TableCell>

      {/* Atributos de variante (talla, color, etc.) */}
      {variantGroup.attributes.map((a) => {
        const option = variant.attributes.find(
          (attr) => attr.attributeCode === a.attributeCode
        );
        return (
          <TableCell key={a.attributeId}>
            <label>{option?.optionText || '--'}</label>
          </TableCell>
        );
      })}

      {/* SKU como link a la edición de ese producto */}
      <TableCell>
        <Button
          variant="link"
          className="hover:cursor-pointer"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            window.location.href = variant.product.editUrl;
          }}
        >
          {variant.product?.sku}
        </Button>
      </TableCell>

      {/* Precio */}
      <TableCell>{variant.product?.price?.regular?.text}</TableCell>

      {/* Stock */}
      <TableCell>{variant.product?.inventory?.qty}</TableCell>

      {/* Estado */}
      <TableCell>
        {variant.product?.status === 1 ? (
          <span style={{ color: '#16a34a', fontWeight: 500 }}>Activo</span>
        ) : (
          <span style={{ color: '#dc2626', fontWeight: 500 }}>Inactivo</span>
        )}
      </TableCell>

      {/* Acciones */}
      <TableCell>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Button
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              window.location.href = variant.product.editUrl;
            }}
          >
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleUnlink();
            }}
            disabled={unlinking}
            style={{ color: '#dc2626', borderColor: '#dc2626' }}
          >
            {unlinking ? 'Desvinculando…' : 'Desvincular'}
          </Button>
          {rowError && (
            <p style={{ fontSize: '11px', color: '#dc2626', margin: 0 }}>
              {rowError}
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ---------------------------------------------------------------------------
// Tabla de variantes (equivalente a Variants.js del core)
// ---------------------------------------------------------------------------
interface VariantsTableProps {
  productId: number;
  variantGroup: VGroup;
}

function VariantsTable({ productId, variantGroup }: VariantsTableProps) {
  const [result, reexecuteQuery] = useQuery({
    query: VariantQuery,
    variables: { productId }
  });

  const refresh = () => {
    reexecuteQuery({ requestPolicy: 'network-only' });
  };

  const { data, fetching, error } = result;

  if (fetching) {
    return (
      <CardContent>
        <p style={{ color: '#6b7280', padding: '8px' }}>Cargando variantes…</p>
      </CardContent>
    );
  }

  if (error) {
    return (
      <CardContent>
        <p style={{ color: '#dc2626' }}>{error.message}</p>
      </CardContent>
    );
  }

  const items: VariantItem[] =
    data?.product?.variantGroup?.items ?? [];

  // Excluir el producto actual (mismo patrón que el core)
  const otherVariants = items.filter(
    (v) => v.product.productId !== productId
  );

  if (otherVariants.length === 0) {
    return (
      <CardContent>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Sin otras variantes en este grupo.
        </p>
      </CardContent>
    );
  }

  return (
    <CardContent>
      <div className="variant-list overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              {variantGroup.attributes.map((a) => (
                <TableHead key={a.attributeId}>{a.attributeName}</TableHead>
              ))}
              <TableHead>SKU</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {otherVariants.map((v) => (
              <VariantRow
                key={v.id}
                variant={v}
                variantGroup={variantGroup}
                refresh={refresh}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  );
}

// ---------------------------------------------------------------------------
// Componente principal — reemplaza VariantGroup.js del core
// ---------------------------------------------------------------------------
interface VariantGroupProps {
  product: ProductProps;
  createVariantGroupApi: string;
  createProductApi: string;
}

const VariantGroup = ({ product }: VariantGroupProps) => {
  const group = product?.variantGroup ?? null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grupo de variantes</CardTitle>
        <CardDescription>
          Gestioná las variantes de este producto. Usá &quot;Desvincular&quot; para
          separar un producto del grupo sin borrarlo.
        </CardDescription>
      </CardHeader>

      {!group && (
        <CardContent>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Este producto no pertenece a un grupo de variantes.
          </p>
        </CardContent>
      )}

      {group && (
        <VariantsTable
          productId={product.productId}
          variantGroup={group}
        />
      )}
    </Card>
  );
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
