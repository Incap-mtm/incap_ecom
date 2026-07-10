declare namespace _default {
    namespace Product {
        function sizeVariants(product: any, _: any, { pool }: {
            pool: any;
        }): Promise<{
            label: any;
            url: string;
            isCurrent: boolean;
        }[] | null>;
        function relatedProducts(product: any, _: any, { pool }: {
            pool: any;
        }): Promise<Record<string, any>[]>;
    }
}
export default _default;
