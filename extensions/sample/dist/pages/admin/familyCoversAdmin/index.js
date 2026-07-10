import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Portadas de familia',
        description: 'Elegí la imagen de portada de cada familia de productos'
    });
    next();
};
//# sourceMappingURL=index.js.map