export default {
  Query: {
    // Resolver "echo": recibe los settings guardados del widget (via getWidgetSetting)
    // y los devuelve tipados. Mismo patrón que el slideshowWidget nativo.
    heroSliderWidget: (_, { slides, autoplaySpeed }) => ({
      slides: Array.isArray(slides) ? slides : [],
      autoplaySpeed: Number(autoplaySpeed) || 8000
    })
  }
};
