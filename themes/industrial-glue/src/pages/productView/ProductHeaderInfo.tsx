import React from 'react';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';

export default function ProductHeaderInfo() {
  const product = useProduct();
  const name = product?.name;

  if (!name) return null;

  // El header solo muestra el nombre del producto. El resto de los atributos
  // (usos, código industrial, etc.) viven en la sección de pestañas
  // "Información del Producto" (ver ProductInfoTabs.tsx).
  return (
    <div className="mb-3">
      <h1 className="text-2xl md:text-4xl font-black text-[#181B1C] font-sora mb-3 leading-tight tracking-tight uppercase">
        {name}
      </h1>
    </div>
  );
}

export const layout = {
  areaId: 'productPageMiddleRight',
  sortOrder: 1
};

export const query = `
query Query {
    product: currentProduct {
      name
    }
}
`;
