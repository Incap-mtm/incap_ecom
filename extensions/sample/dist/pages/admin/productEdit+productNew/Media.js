import { FileBrowser } from '@components/admin/FileBrowser.js';
import { ImageUploader } from '@components/admin/ImageUploader.js';
import { Button } from '@components/common/ui/Button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/common/ui/Card.js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import uniqid from 'uniqid';
export default function Media({ product }) {
    const control = useFormContext().control;
    const { fields, append, remove, replace } = useFieldArray({
        name: 'images',
        control
    });
    const [openBrowser, setOpenBrowser] = useState(false);
    useEffect(() => {
        const images = (product === null || product === void 0 ? void 0 : product.image)
            ? [product.image].concat((product === null || product === void 0 ? void 0 : product.gallery) || [])
            : [];
        replace(images);
    }, []);
    const handleBrowserInsert = (fileUrl) => {
        // FileBrowser pasa la URL relativa, ej: /assets/products/Super-PVA/file.jpg
        const path = fileUrl.replace(/^\/?assets\//, '');
        append({ uuid: uniqid(), url: fileUrl, path });
        setOpenBrowser(false);
    };
    return (React.createElement(Card, { title: "Media" },
        React.createElement(CardHeader, null,
            React.createElement(CardTitle, null, "Media"),
            React.createElement(CardDescription, null, "Gestion\u00E1 las im\u00E1genes del producto. Drag & drop para reordenar. La primera imagen es la principal. Sub\u00ED nuevas o seleccion\u00E1 de las existentes en el servidor.")),
        React.createElement(CardContent, null,
            React.createElement(ImageUploader, { currentImages: (product === null || product === void 0 ? void 0 : product.image)
                    ? [product.image].concat((product === null || product === void 0 ? void 0 : product.gallery) || [])
                    : [], allowDelete: true, allowSwap: true, onDelete: (image) => {
                    const index = fields.findIndex((img) => img.uuid === image.uuid);
                    if (index !== -1) {
                        remove(index);
                    }
                }, onUpload: (images) => {
                    append(images);
                }, onSortEnd: (oldIndex, newIndex) => {
                    const newImages = [...fields];
                    const [moved] = newImages.splice(oldIndex, 1);
                    newImages.splice(newIndex, 0, moved);
                    replace(newImages);
                }, targetPath: `catalog/${Math.floor(Math.random() * (9999 - 1000)) + 1000}/${Math.floor(Math.random() * (9999 - 1000)) + 1000}` }),
            React.createElement("div", { className: "mt-4" },
                React.createElement(Button, { variant: "outline", onClick: (e) => {
                        e.preventDefault();
                        setOpenBrowser(true);
                    } }, "Seleccionar imagen del servidor")),
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