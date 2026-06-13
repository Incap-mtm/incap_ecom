import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Guía de uso',
        description: 'Cómo administrar el sitio'
    });
    next();
};
//# sourceMappingURL=index.js.map