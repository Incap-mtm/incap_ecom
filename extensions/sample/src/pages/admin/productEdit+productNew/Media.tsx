import { FileBrowser } from '@components/admin/FileBrowser.js';
import { ImageUploader } from '@components/admin/ImageUploader.js';
import { Button } from '@components/common/ui/Button.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import uniqid from 'uniqid';

interface ProductImage {
  uuid: string;
  path: string;
  url: string;
}

interface MediaProps {
  product?: {
    image?: ProductImage;
    gallery?: ProductImage[];
  };
}

export default function Media({ product }: MediaProps) {
  const control = useFormContext().control;
  const { fields, append, remove, replace } = useFieldArray({
    name: 'images',
    control
  }) as ReturnType<typeof useFieldArray>;

  const [openBrowser, setOpenBrowser] = useState(false);

  useEffect(() => {
    const images = product?.image
      ? [product.image].concat(product?.gallery || [])
      : [];
    replace(images);
  }, []);

  const handleBrowserInsert = (fileUrl: string) => {
    // FileBrowser pasa la URL relativa, ej: /assets/products/Super-PVA/file.jpg
    const path = fileUrl.replace(/^\/?assets\//, '');
    append({ uuid: uniqid(), url: fileUrl, path });
    setOpenBrowser(false);
  };

  return (
    <Card title="Media">
      <CardHeader>
        <CardTitle>Media</CardTitle>
        <CardDescription>
          Gestion&aacute; las im&aacute;genes del producto. Drag &amp; drop para reordenar.
          La primera imagen es la principal. Sub&iacute; nuevas o seleccion&aacute; de las
          existentes en el servidor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ImageUploader
          currentImages={
            product?.image
              ? [product.image].concat(product?.gallery || [])
              : []
          }
          allowDelete={true}
          allowSwap={true}
          onDelete={(image) => {
            const index = fields.findIndex(
              (img) => (img as unknown as ProductImage).uuid === image.uuid
            );
            if (index !== -1) {
              remove(index);
            }
          }}
          onUpload={(images) => {
            append(images);
          }}
          onSortEnd={(oldIndex, newIndex) => {
            const newImages = [...fields];
            const [moved] = newImages.splice(oldIndex, 1);
            newImages.splice(newIndex, 0, moved);
            replace(newImages);
          }}
          targetPath={`catalog/${
            Math.floor(Math.random() * (9999 - 1000)) + 1000
          }/${Math.floor(Math.random() * (9999 - 1000)) + 1000}`}
        />

        <div className="mt-4">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setOpenBrowser(true);
            }}
          >
            Seleccionar imagen del servidor
          </Button>
        </div>

        {openBrowser && (
          <FileBrowser
            isMultiple={false}
            onInsert={handleBrowserInsert}
            close={() => setOpenBrowser(false)}
          />
        )}
      </CardContent>
    </Card>
  );
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
