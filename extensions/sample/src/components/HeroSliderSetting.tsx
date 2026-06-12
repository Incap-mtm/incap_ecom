/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { FileBrowser } from '@components/admin/FileBrowser.js';
import { Button } from '@components/common/ui/Button.js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import uniqid from 'uniqid';

interface HeroSlide {
  id: string;
  deskImage: string;
  mobileImage?: string;
  alt?: string;
}

interface HeroSliderSettingProps {
  heroSliderWidget?: {
    slides?: HeroSlide[];
    autoplaySpeed?: number;
  };
}

const MAX_BYTES = 1024 * 1024; // 1 MB

// Valida que la imagen seleccionada sea WebP y pese menos de 1 MB.
// Devuelve un mensaje de error, o null si es válida.
async function validateImage(url: string): Promise<string | null> {
  if (!/\.webp(\?.*)?$/i.test(url)) {
    return 'La imagen debe estar en formato WebP (.webp).';
  }
  try {
    const res = await fetch(url, { method: 'HEAD' });
    const size = Number(res.headers.get('content-length') || 0);
    if (size > MAX_BYTES) {
      return `La imagen pesa ${(size / MAX_BYTES).toFixed(2)} MB. El máximo permitido es 1 MB.`;
    }
  } catch {
    // Si HEAD falla, no bloqueamos por peso (el formato ya se validó).
  }
  return null;
}

export default function HeroSliderSetting({ heroSliderWidget }: HeroSliderSettingProps) {
  const { slides = [], autoplaySpeed = 5000 } = heroSliderWidget || {};
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'settings.slides'
  });

  const currentSlides: HeroSlide[] = watch('settings.slides', slides) || [];
  const currentSpeed = watch('settings.autoplaySpeed', autoplaySpeed);

  useEffect(() => {
    setValue('settings.slides', slides?.length ? slides : []);
    setValue('settings.autoplaySpeed', Number(autoplaySpeed) || 5000);
  }, []);

  const [openBrowser, setOpenBrowser] = useState(false);
  const [target, setTarget] = useState<{ index: number; field: 'deskImage' | 'mobileImage' } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const patchSlide = (index: number, patch: Partial<HeroSlide>) => {
    const next = [...currentSlides];
    next[index] = { ...next[index], ...patch };
    setValue('settings.slides', next);
  };

  const handleSelect = async (image: string) => {
    setOpenBrowser(false);
    if (!target) return;
    const err = await validateImage(image);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    patchSlide(target.index, { [target.field]: image });
    setTarget(null);
  };

  const openPicker = (index: number, field: 'deskImage' | 'mobileImage') => {
    setError(null);
    setTarget({ index, field });
    setOpenBrowser(true);
  };

  const addSlide = () => {
    append({ id: uniqid(), deskImage: '', mobileImage: '', alt: '' });
  };

  return (
    <div className="hero-slider-widget">
      {openBrowser && (
        <div className="max-h-96">
          <FileBrowser isMultiple={false} onInsert={handleSelect} close={() => setOpenBrowser(false)} />
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4 text-sm text-blue-800">
        <strong>Requisitos de imagen:</strong> formato <strong>WebP</strong>, peso máximo <strong>1 MB</strong>.
        Recomendado: desktop 2667×1250 px, mobile 782×1390 px.
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Velocidad de autoplay (ms)</label>
        <input
          type="number"
          min={1000}
          step={500}
          className="w-48 p-2 border border-gray-300 rounded"
          value={Number(currentSpeed) || 5000}
          onChange={(e) => setValue('settings.autoplaySpeed', Number(e.target.value) || 5000)}
        />
      </div>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">Slides del Hero</h2>
        <Button onClick={addSlide} variant="outline">Agregar slide</Button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
          {error}
        </p>
      )}

      {fields.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No hay slides todavía.</p>
          <Button variant="outline" onClick={addSlide}>Agregar el primero</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => {
            const slide = currentSlides[index] || ({} as HeroSlide);
            return (
              <div key={field.id} className="border border-border rounded p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-medium">Slide {index + 1}</h3>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled={index === 0} onClick={() => move(index, index - 1)}>↑</Button>
                    <Button variant="outline" size="sm" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>↓</Button>
                    <Button variant="destructive" size="sm" onClick={() => remove(index)}>Eliminar</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Imagen desktop */}
                  <div>
                    <label className="block mb-1 text-sm">Imagen Desktop (WebP, &lt;1MB)</label>
                    <div className="aspect-[2.13/1] bg-gray-100 border border-border rounded overflow-hidden flex items-center justify-center mb-2">
                      {slide.deskImage ? (
                        <img src={slide.deskImage} alt="Desktop" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openPicker(index, 'deskImage')}>
                      {slide.deskImage ? 'Cambiar' : 'Seleccionar'} desktop
                    </Button>
                  </div>

                  {/* Imagen mobile */}
                  <div>
                    <label className="block mb-1 text-sm">Imagen Mobile (WebP, &lt;1MB)</label>
                    <div className="aspect-[0.56/1] max-h-48 bg-gray-100 border border-border rounded overflow-hidden flex items-center justify-center mb-2 mx-auto">
                      {slide.mobileImage ? (
                        <img src={slide.mobileImage} alt="Mobile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-gray-400 text-sm">Sin imagen</span>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openPicker(index, 'mobileImage')}>
                      {slide.mobileImage ? 'Cambiar' : 'Seleccionar'} mobile
                    </Button>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block mb-1 text-sm">Texto alternativo (alt / SEO)</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={slide.alt || ''}
                    onChange={(e) => patchSlide(index, { alt: e.target.value })}
                    placeholder="Ej: Adhesivos industriales INCAP para la industria del calzado"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
