declare namespace _default {
    namespace Product {
        function sizeVariants(product: any, _: any, { pool }: {
            pool: any;
        }): Promise<{
            label: any;
            url: string;
            isCurrent: boolean;
        }[] | null>;
    }
}
export default _default;
