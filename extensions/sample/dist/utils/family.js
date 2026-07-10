export function getFamily(name) {
    if (!name)
        return '';
    const idx = name.lastIndexOf(' - ');
    return (idx === -1 ? name : name.substring(0, idx)).trim();
}
export function getPresentation(name) {
    if (!name)
        return '';
    const idx = name.lastIndexOf(' - ');
    return idx === -1 ? '' : name.substring(idx + 3).trim();
}
export function parsePresentationSize(presentation) {
    if (!presentation)
        return 0;
    const lower = presentation.toLowerCase();
    const match = lower.match(/(\d+(?:[.,]\d+)?)/);
    const num = match ? parseFloat(match[1].replace(',', '.')) : 0;
    if (!num)
        return 0;
    if (/gal[oó]n|galones|gal\b/.test(lower))
        return num * 3785;
    if (/\blt?s?\b|\blitro/.test(lower))
        return num * 1000;
    if (/\bml\b|\bcc\b|\bcm3\b/.test(lower))
        return num;
    if (/\bkg\b/.test(lower))
        return num * 1000;
    if (/\bgr?\b/.test(lower))
        return num;
    if (/\blb\b|\blibra/.test(lower))
        return num * 454;
    if (/\boz\b|\bonza/.test(lower))
        return num * 30;
    return num;
}
export function pickRepresentative(products, preferredUuid) {
    if (!products || products.length === 0)
        return products[0];
    if (products.length === 1)
        return products[0];
    if (preferredUuid) {
        const preferred = products.find(p => p.uuid === preferredUuid);
        if (preferred)
            return preferred;
    }
    const withImages = products.filter(p => { var _a; return (_a = p.image) === null || _a === void 0 ? void 0 : _a.url; });
    const pool = withImages.length > 0 ? withImages : products;
    if (pool.length === 1)
        return pool[0];
    const sorted = [...pool].sort((a, b) => {
        const sizeA = parsePresentationSize(getPresentation(a.name));
        const sizeB = parsePresentationSize(getPresentation(b.name));
        return sizeA - sizeB;
    });
    return sorted[Math.floor(sorted.length / 2)];
}
//# sourceMappingURL=family.js.map