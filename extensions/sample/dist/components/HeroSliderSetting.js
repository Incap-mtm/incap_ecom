/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { FileBrowser } from '@components/admin/FileBrowser.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import uniqid from 'uniqid';
const MAX_BYTES = 1024 * 1024; // 1 MB
// Valida que la imagen seleccionada sea WebP y pese menos de 1 MB.
// Devuelve un mensaje de error, o null si es válida.
async function validateImage(url) {
    if (!/\.webp(\?.*)?$/i.test(url)) {
        return 'La imagen debe estar en formato WebP (.webp).';
    }
    try {
        const res = await fetch(url, { method: 'HEAD' });
        const size = Number(res.headers.get('content-length') || 0);
        if (size > MAX_BYTES) {
            return `La imagen pesa ${(size / MAX_BYTES).toFixed(2)} MB. El máximo permitido es 1 MB.`;
        }
    }
    catch (_a) {
        // Si HEAD falla, no bloqueamos por peso (el formato ya se validó).
    }
    return null;
}
export default function HeroSliderSetting({ heroSliderWidget }) {
    const { slides = [], autoplaySpeed = 8000 } = heroSliderWidget || {};
    const { control, setValue, watch } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: 'settings.slides'
    });
    const currentSlides = watch('settings.slides', slides) || [];
    const currentSpeed = watch('settings.autoplaySpeed', autoplaySpeed);
    useEffect(() => {
        setValue('settings.slides', (slides === null || slides === void 0 ? void 0 : slides.length) ? slides : []);
        setValue('settings.autoplaySpeed', Number(autoplaySpeed) || 8000);
    }, []);
    const [openBrowser, setOpenBrowser] = useState(false);
    const [target, setTarget] = useState(null);
    const [error, setError] = useState(null);
    const patchSlide = (index, patch) => {
        const next = [...currentSlides];
        next[index] = { ...next[index], ...patch };
        setValue('settings.slides', next);
    };
    const handleSelect = async (image) => {
        setOpenBrowser(false);
        if (!target)
            return;
        const err = await validateImage(image);
        if (err) {
            setError(err);
            return;
        }
        setError(null);
        patchSlide(target.index, { [target.field]: image });
        setTarget(null);
    };
    const openPicker = (index, field) => {
        setError(null);
        setTarget({ index, field });
        setOpenBrowser(true);
    };
    const addSlide = () => {
        append({ id: uniqid(), deskImage: '', mobileImage: '', alt: '' });
    };
    return (React.createElement("div", { className: "hero-slider-widget" },
        openBrowser && (React.createElement("div", { className: "max-h-96" },
            React.createElement(FileBrowser, { isMultiple: false, onInsert: handleSelect, close: () => setOpenBrowser(false) }))),
        React.createElement("div", { className: "bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800" },
            React.createElement("strong", null, "Requisitos de imagen:"),
            " formato ",
            React.createElement("strong", null, "WebP"),
            ", peso m\u00E1ximo ",
            React.createElement("strong", null, "1 MB"),
            ". Recomendado: desktop 2667\u00D71250 px, mobile 782\u00D71390 px."),
        React.createElement("div", { className: "mb-4" },
            React.createElement("label", { className: "block mb-1 text-sm font-medium" }, "Velocidad de autoplay (ms)"),
            React.createElement("input", { type: "number", min: 1000, step: 500, className: "w-48 p-2 border border-gray-300 rounded", value: Number(currentSpeed) || 8000, onChange: (e) => setValue('settings.autoplaySpeed', Number(e.target.value) || 8000) })),
        React.createElement("div", { className: "flex justify-between items-center mb-2" },
            React.createElement("h2", { className: "text-lg font-medium" }, "Slides del Hero"),
            React.createElement(Button, { onClick: addSlide, variant: "outline" }, "Agregar slide")),
        error && (React.createElement("p", { className: "text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3" }, error)),
        fields.length === 0 ? (React.createElement("div", { className: "bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center" },
            React.createElement("p", { className: "text-gray-500 mb-4" }, "No hay slides todav\u00EDa."),
            React.createElement(Button, { variant: "outline", onClick: addSlide }, "Agregar el primero"))) : (React.createElement("div", { className: "space-y-4" }, fields.map((field, index) => {
            const slide = currentSlides[index] || {};
            return (React.createElement("div", { key: field.id, className: "border border-border rounded p-4 bg-white" },
                React.createElement("div", { className: "flex justify-between items-center mb-3" },
                    React.createElement("h3", { className: "text-sm font-medium" },
                        "Slide ",
                        index + 1),
                    React.createElement("div", { className: "flex gap-1" },
                        React.createElement(Button, { variant: "outline", size: "sm", disabled: index === 0, onClick: () => move(index, index - 1) }, "\u2191"),
                        React.createElement(Button, { variant: "outline", size: "sm", disabled: index === fields.length - 1, onClick: () => move(index, index + 1) }, "\u2193"),
                        React.createElement(Button, { variant: "destructive", size: "sm", onClick: () => remove(index) }, "Eliminar"))),
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                    React.createElement("div", null,
                        React.createElement("label", { className: "block mb-1 text-sm" }, "Imagen Desktop (WebP, <1MB)"),
                        React.createElement("div", { className: "aspect-[2.13/1] bg-gray-100 border border-border rounded overflow-hidden flex items-center justify-center mb-2" }, slide.deskImage ? (React.createElement("img", { src: slide.deskImage, alt: "Desktop", className: "w-full h-full object-cover" })) : (React.createElement("span", { className: "text-gray-400 text-sm" }, "Sin imagen"))),
                        React.createElement(Button, { variant: "outline", size: "sm", onClick: () => openPicker(index, 'deskImage') },
                            slide.deskImage ? 'Cambiar' : 'Seleccionar',
                            " desktop")),
                    React.createElement("div", null,
                        React.createElement("label", { className: "block mb-1 text-sm" }, "Imagen Mobile (WebP, <1MB)"),
                        React.createElement("div", { className: "aspect-[0.56/1] max-h-48 bg-gray-100 border border-border rounded overflow-hidden flex items-center justify-center mb-2 mx-auto" }, slide.mobileImage ? (React.createElement("img", { src: slide.mobileImage, alt: "Mobile", className: "w-full h-full object-cover" })) : (React.createElement("span", { className: "text-gray-400 text-sm" }, "Sin imagen"))),
                        React.createElement(Button, { variant: "outline", size: "sm", onClick: () => openPicker(index, 'mobileImage') },
                            slide.mobileImage ? 'Cambiar' : 'Seleccionar',
                            " mobile"))),
                React.createElement("div", { className: "mt-3" },
                    React.createElement("label", { className: "block mb-1 text-sm" }, "Texto alternativo (alt / SEO)"),
                    React.createElement("input", { type: "text", className: "w-full p-2 border border-gray-300 rounded", value: slide.alt || '', onChange: (e) => patchSlide(index, { alt: e.target.value }), placeholder: "Ej: Adhesivos industriales INCAP para la industria del calzado" }))));
        })))));
}
export const query = `
  query Query($slides: [HeroSlideInput], $autoplaySpeed: Int) {
    heroSliderWidget(slides: $slides, autoplaySpeed: $autoplaySpeed) {
      slides {
        id
        deskImage
        mobileImage
        alt
      }
      autoplaySpeed
    }
  }
`;
export const fragments = `
  fragment HeroSlideData on HeroSlide {
    id
    deskImage
    mobileImage
    alt
  }
`;
export const variables = `{
  slides: getWidgetSetting("slides"),
  autoplaySpeed: getWidgetSetting("autoplaySpeed")
}`;
//# sourceMappingURL=HeroSliderSetting.js.map