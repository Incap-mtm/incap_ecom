import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Productos destacados',
        description: 'Elegí los productos que aparecen en el carrusel de destacados del home'
    });
    next();
};
//# sourceMappingURL=index.js.map