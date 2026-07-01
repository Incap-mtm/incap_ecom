import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Catálogo descargable',
        description: 'Actualizar el PDF del catálogo y el texto del botón del header',
    });
    next();
};
//# sourceMappingURL=index.js.map