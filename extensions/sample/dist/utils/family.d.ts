export declare function getFamily(name: string): string;
export declare function getPresentation(name: string): string;
export declare function parsePresentationSize(presentation: string): number;
export declare function pickRepresentative<T extends {
    name: string;
    uuid?: string;
    image?: {
        url?: string;
    } | null;
}>(products: T[], preferredUuid?: string): T;
