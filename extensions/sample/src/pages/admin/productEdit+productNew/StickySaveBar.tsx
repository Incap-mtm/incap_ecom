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
export default function StickySaveBar() {
  return (
    <style>{`
      .form-submit-button {
        position: sticky;
        bottom: 0;
        z-index: 30;
        background: var(--background, #ffffff);
        margin-top: 1.5rem;
        padding: 0.9rem 1rem;
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -6px 18px rgba(24, 27, 28, 0.10);
        gap: 0.75rem;
      }
      /* En pantallas bajas, asegurar que la barra no tape contenido al final */
      #productEditForm, #productNewForm {
        padding-bottom: 0.5rem;
      }
    `}</style>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 5
};
