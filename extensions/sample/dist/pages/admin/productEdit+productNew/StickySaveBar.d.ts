import React from 'react';
/**
 * Barra de guardado siempre visible en el editor de producto.
 *
 * El core (`ProductEditForm.js`) renderiza los botones Cancel/Save dentro de un
 * `<div class="form-submit-button ...">` al FINAL del formulario, después de la
 * grilla de columnas. Con muchos atributos completados la página se vuelve muy
 * larga y el Save queda fuera de vista.
 *
 * Este componente NO renderiza UI: solo inyecta CSS que fija esa barra al fondo
 * del viewport (position: sticky) para que Cancel/Save queden siempre a mano,
 * sin overridear la lógica del formulario del core. Aplica a productEdit y
 * productNew (carpeta productEdit+productNew).
 */
export default function StickySaveBar(): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
