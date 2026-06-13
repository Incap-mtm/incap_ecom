import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    const id = parseInt(request.params.id, 10);
    if (!isNaN(id)) {
        setContextValue(request, 'adminUserId', id);
    }
    setContextValue(request, 'pageInfo', {
        title: 'Editar usuario',
        description: 'Editar usuario administrador'
    });
    next();
};
//# sourceMappingURL=index.js.map