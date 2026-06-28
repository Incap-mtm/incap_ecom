import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Gestión del Blog',
        description: 'Administrar los metadatos e índice de artículos del blog INCAP',
    });
    next();
};
//# sourceMappingURL=index.js.map