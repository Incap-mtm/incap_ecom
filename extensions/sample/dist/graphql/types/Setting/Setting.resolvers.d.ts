declare namespace _default {
    namespace Setting {
        function storeWhatsappNumber(setting: any): any;
        function googleMapsKey(): string;
        function storeInstagram(setting: any): any;
        function storeFacebook(setting: any): any;
        function storeLinkedin(setting: any): any;
        function storeTiktok(setting: any): any;
        function storeYoutube(setting: any): any;
        function variantSizeOrder(setting: any): any;
        function quienesSomos(setting: any): any;
        function blogIndex(setting: any): any;
    }
    namespace Query {
        function sizeOptions(_: any, __: any, { pool: ctxPool }: {
            pool: any;
        }): Promise<any>;
    }
}
export default _default;
