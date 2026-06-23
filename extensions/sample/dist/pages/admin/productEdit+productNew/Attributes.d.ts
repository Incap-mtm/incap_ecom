import React from 'react';
export default function Attributes({ product, groups: { items } }: {
    product: any;
    groups: {
        items: any;
    };
}): React.JSX.Element;
export declare const layout: {
    areaId: string;
    sortOrder: number;
};
export declare const query = "\n  query Query ($filters: [FilterInput!]) {\n    product(id: getContextValue(\"productId\", null)) {\n      groupId\n      variantGroupId\n      attributeIndex {\n        attributeId\n        optionId\n        optionText\n      }\n    },\n    groups: attributeGroups(filters: $filters) {\n      items {\n        groupId: attributeGroupId\n        groupName\n        attributes {\n          items {\n            attribute_id: attributeId\n            attribute_name: attributeName\n            attribute_code: attributeCode\n            type\n            is_required: isRequired\n            options {\n              value: attributeOptionId\n              label: optionText\n            }\n          }\n        }\n      }\n    }\n  }\n";
export declare const variables = "\n{\n  filters: [{ key: \"limit\", operation: 'eq', value: 1000 }]\n}";
