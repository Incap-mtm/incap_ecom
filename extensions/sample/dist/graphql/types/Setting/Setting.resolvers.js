export default {
    Setting: {
        storeWhatsappNumber: (setting) => {
            const s = setting.find((item) => item.name === 'storeWhatsappNumber');
            return s ? s.value : '573002171521';
        },
        googleMapsKey: () => process.env.GOOGLE_MAPS_API_KEY || ''
    }
};
//# sourceMappingURL=Setting.resolvers.js.map