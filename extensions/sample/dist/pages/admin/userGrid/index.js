import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Usuarios admin',
        description: 'Gestión de usuarios administradores'
    });
    next();
};
//# sourceMappingURL=index.js.map