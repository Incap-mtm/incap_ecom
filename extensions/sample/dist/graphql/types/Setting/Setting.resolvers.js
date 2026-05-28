const findSetting = (setting, name, fallback = '') => (setting.find((item) => item.name === name) || {}).value || fallback;
export default {
    Setting: {
        storeWhatsappNumber: (setting) => findSetting(setting, 'storeWhatsappNumber', '573002171521'),
        googleMapsKey: () => process.env.GOOGLE_MAPS_API_KEY || '',
        storeInstagram: (setting) => findSetting(setting, 'storeInstagram'),
        storeFacebook: (setting) => findSetting(setting, 'storeFacebook'),
        storeLinkedin: (setting) => findSetting(setting, 'storeLinkedin'),
        storeTiktok: (setting) => findSetting(setting, 'storeTiktok'),
        storeYoutube: (setting) => findSetting(setting, 'storeYoutube'),
    }
};
//# sourceMappingURL=Setting.resolvers.js.map