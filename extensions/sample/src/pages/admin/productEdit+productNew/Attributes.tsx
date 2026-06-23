import { InputField } from '@components/common/form/InputField.js';
import { ReactSelectField } from '@components/common/form/ReactSelectField.js';
import { SelectField } from '@components/common/form/SelectField.js';
import { TextareaField } from '@components/common/form/TextareaField.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@components/common/ui/Card.js';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from '@components/common/ui/Table.js';
import React, { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

/**
 * Override del bloque "Attribute group" del admin (productEdit/productNew).
 *
 * Reemplaza el componente nativo (catalog/.../Attributes.js) conservando EXACTAMENTE
 * la lógica de formulario (useFieldArray name="attributes", rebuild al cambiar de grupo,
 * input oculto attribute_code, name `attributes.${i}.value`) para no romper el guardado.
 *
 * Mejoras de edición:
 *  - Los atributos de texto largo (usos, modo_empleo, preguntas_frecuentes, etc.) se editan
 *    en un <textarea> multilínea en vez del input de una sola línea.
 *  - Cada campo conocido muestra un ícono ⓘ con el formato esperado + un ejemplo (tooltip
 *    estilado en hover, y `title` nativo como fallback) para evitar cargas mal formateadas.
 */

interface AttributeHelp {
  formato: string;
  ejemplo: string;
}

// Ayuda contextual por código de atributo (espejo de la guía /admin/guia).
const FIELD_HELP: Record<string, AttributeHelp> = {
  usos: {
    formato: 'Separá cada uso con " - " (espacio, guion, espacio). Se muestra como lista con viñetas.',
    ejemplo: 'Pegado de suelas - Unión de cueros - Forrado de plantillas'
  },
  caracteristicas: {
    formato: 'Separá cada característica con " - ". Se muestra como lista con viñetas.',
    ejemplo: 'Base poliuretano - Color ámbar - Viscosidad 2500 cp - Secado 15 min'
  },
  modo_empleo: {
    formato: 'Cada paso con el patrón "N. Título: detalle", separados por " - ".',
    ejemplo: '1. Preparar: limpie la superficie de polvo y grasa - 2. Aplicar: extienda una capa uniforme con brocha'
  },
  preguntas_frecuentes: {
    formato: 'Cada pregunta abre con "¿" y cierra con "?", seguida de su respuesta. Separá cada par con " - ".',
    ejemplo: '¿Se debe diluir antes de usar? No, viene listo para aplicar. - ¿Cuánto tarda en secar? Entre 10 y 15 minutos.'
  },
  precauciones_h: {
    formato: 'Separá cada declaración de peligro (H) con " - ".',
    ejemplo: 'H226 Líquido y vapores inflamables - H336 Puede provocar somnolencia'
  },
  consejos_prudencia_p: {
    formato: 'Separá cada consejo de prudencia (P) con " - ".',
    ejemplo: 'P210 Mantener alejado del calor - P260 No respirar los vapores'
  },
  ghs_pictogramas: {
    formato: 'Solo los códigos de pictograma, separados por " - ". Acepta GHS02, SGA 02, etc.',
    ejemplo: 'GHS02 - GHS07'
  },
  codigo_industrial: {
    formato: 'Texto simple, sin formato especial.',
    ejemplo: 'I-111'
  },
  ficha_tecnica_url: {
    formato: 'Una URL completa (https://…) o una ruta interna que empiece con "/". Sin espacios.',
    ejemplo: 'https://www.grupoincap.com.co/media/fichas/lamifort.pdf'
  }
};

// Atributos de texto que se editan mejor en un textarea multilínea.
const LONG_TEXT = new Set([
  'usos',
  'caracteristicas',
  'modo_empleo',
  'preguntas_frecuentes',
  'precauciones_h',
  'consejos_prudencia_p',
  'pre_tratamiento'
]);

const getGroup = (groups = [], groupId) =>
  groups.find((group) => group.groupId === groupId) || groups[0];

const getAttributeOptions = (groups, attributeId) => {
  const attribute = groups
    .find((group) =>
      group.attributes.items.find((attr) => attr.attribute_id === attributeId)
    )
    ?.attributes.items.find((attr) => attr.attribute_id === attributeId);
  return attribute ? attribute.options : [];
};

const getAttributeSelectedValues = (
  attributeIndex,
  attributeId,
  attributeType
) => {
  switch (attributeType) {
    case 'text':
    case 'textarea':
    case 'date':
    case 'datetime':
      return (
        attributeIndex.find((idx) => idx.attributeId === attributeId)
          ?.optionText || ''
      );
    case 'select':
      return (
        attributeIndex
          .find((idx) => idx.attributeId === attributeId)
          ?.optionId.toString() || ''
      );
    case 'multiselect':
      return attributeIndex
        .filter((idx) => idx.attributeId === attributeId)
        .map((idx) => idx.optionId.toString());
    default:
      return '';
  }
};

// Ícono ⓘ con tooltip de formato + ejemplo (fallback nativo via `title`).
function HelpTip({ help }: { help?: AttributeHelp }) {
  if (!help) return null;
  const titleFallback = `Formato: ${help.formato}\n\nEjemplo: ${help.ejemplo}`;
  return (
    <span
      className="group/help relative inline-flex align-middle ml-1.5 cursor-help"
      title={titleFallback}
    >
      <span className="flex items-center justify-center w-4 h-4 rounded-full border border-border bg-muted text-muted-foreground text-[10px] font-bold leading-none">
        i
      </span>
      <span className="invisible opacity-0 group-hover/help:visible group-hover/help:opacity-100 transition-opacity absolute z-50 left-0 top-5 w-72 p-3 rounded-lg bg-[#181B1C] text-white shadow-xl pointer-events-none">
        <span className="block text-[10px] font-bold uppercase tracking-wide text-white/50 mb-1">
          Formato
        </span>
        <span className="block text-xs leading-relaxed text-white/90 mb-2">
          {help.formato}
        </span>
        <span className="block text-[10px] font-bold uppercase tracking-wide text-white/50 mb-1">
          Ejemplo
        </span>
        <span className="block font-mono text-[11px] leading-relaxed text-[#85C639] break-words">
          {help.ejemplo}
        </span>
      </span>
    </span>
  );
}

export default function Attributes({ product, groups: { items } }) {
  const { unregister, watch } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    name: 'attributes'
  });
  const attributeIndex = product?.attributeIndex || [];
  const currentGroup = watch(
    'group_id',
    getGroup(items, product?.groupId)?.groupId || undefined
  );

  useEffect(() => {
    if (currentGroup) {
      fields.forEach((_, index) => {
        unregister(`attributes.${index}`);
      });
      remove();
      const attributes = getGroup(items, currentGroup)?.attributes.items || [];
      const newFields = attributes.map((attribute) => ({
        attribute_code: attribute.attribute_code,
        attribute_name: attribute.attribute_name,
        type: attribute.type,
        attribute_id: attribute.attribute_id,
        value: getAttributeSelectedValues(
          attributeIndex,
          attribute.attribute_id,
          attribute.type
        ),
        is_required: attribute.is_required
      }));
      append(newFields);
    }
  }, [currentGroup, items, append, remove, unregister]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atributos del producto</CardTitle>
        <CardDescription>
          Información técnica que se muestra en la ficha del producto. Pasá el cursor
          sobre el ícono <strong>ⓘ</strong> de cada campo para ver el formato y un ejemplo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {product?.variantGroupId && (
            <div className="flex flex-col">
              <InputField
                type="hidden"
                defaultValue={product?.groupId}
                name="group_id"
              />
              <div>
                <span className="font-semibold">
                  {getGroup(items, product?.groupId).groupName}
                </span>
                <p className="text-muted-foreground italic">
                  Can not change the attribute group of a product that is already
                  in a variant group.
                </p>
              </div>
            </div>
          )}
          {!product?.variantGroupId && (
            <SelectField
              name="group_id"
              label="Attribute group"
              options={items.map((group) => ({
                value: group.groupId,
                label: group.groupName
              }))}
              defaultValue={product?.groupId || currentGroup}
              required
            />
          )}
        </div>
      </CardContent>
      <CardContent>
        <Table>
          <TableBody>
            {fields.map((attribute, index) => {
              const validation =
                attribute.is_required === 1
                  ? { required: `${attribute.attribute_name} is required` }
                  : {};
              const help = FIELD_HELP[attribute.attribute_code];
              const isLong =
                attribute.type === 'text' &&
                LONG_TEXT.has(attribute.attribute_code);
              let Field = null;
              switch (attribute.type) {
                case 'textarea':
                  Field = (
                    <TextareaField
                      name={`attributes.${index}.value`}
                      rows={4}
                      required={attribute.is_required === 1}
                      validation={validation}
                    />
                  );
                  break;
                case 'select':
                  Field = (
                    <SelectField
                      name={`attributes.${index}.value`}
                      options={getAttributeOptions(
                        items,
                        attribute.attribute_id
                      )}
                      placeholder="Select an option"
                      validation={validation}
                    />
                  );
                  break;
                case 'multiselect':
                  Field = (
                    <ReactSelectField
                      name={`attributes.${index}.value`}
                      options={getAttributeOptions(
                        items,
                        attribute.attribute_id
                      )}
                      placeholder="Select options"
                      required={attribute.is_required === 1}
                      validation={validation}
                      isMulti
                    />
                  );
                  break;
                case 'text':
                  // Texto largo conocido → textarea; texto corto → input.
                  Field = isLong ? (
                    <TextareaField
                      name={`attributes.${index}.value`}
                      rows={4}
                      required={attribute.is_required === 1}
                      validation={validation}
                    />
                  ) : (
                    <InputField
                      name={`attributes.${index}.value`}
                      required={attribute.is_required === 1}
                      validation={validation}
                    />
                  );
                  break;
                default:
                  Field = (
                    <InputField
                      name={`attributes.${index}.value`}
                      required={attribute.is_required === 1}
                      validation={validation}
                      placeholder={`Enter value for ${attribute.attribute_name}`}
                    />
                  );
                  break;
              }
              return (
                <TableRow key={attribute.id}>
                  <TableCell className="align-top whitespace-nowrap">
                    <span>{attribute.attribute_name}</span>
                    {attribute.is_required === 1 && (
                      <span className="text-destructive pl-1">*</span>
                    )}
                    <HelpTip help={help} />
                  </TableCell>
                  <TableCell>
                    <InputField
                      type="hidden"
                      value={attribute.attribute_code}
                      name={`attributes.${index}.attribute_code`}
                    />
                    {Field}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export const layout = {
  areaId: 'rightSide',
  sortOrder: 30
};

export const query = `
  query Query ($filters: [FilterInput!]) {
    product(id: getContextValue("productId", null)) {
      groupId
      variantGroupId
      attributeIndex {
        attributeId
        optionId
        optionText
      }
    },
    groups: attributeGroups(filters: $filters) {
      items {
        groupId: attributeGroupId
        groupName
        attributes {
          items {
            attribute_id: attributeId
            attribute_name: attributeName
            attribute_code: attributeCode
            type
            is_required: isRequired
            options {
              value: attributeOptionId
              label: optionText
            }
          }
        }
      }
    }
  }
`;

export const variables = `
{
  filters: [{ key: "limit", operation: 'eq', value: 1000 }]
}`;
