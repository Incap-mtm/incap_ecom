import { setContextValue } from '@evershop/evershop/graphql/services';
export default (request, _response, next) => {
    setContextValue(request, 'pageInfo', {
        title: 'Alianzas — Quiénes Somos',
        description: 'Editar las ciudades y la imagen de la sección "Alianzas que construyen país"',
    });
    next();
};
//# sourceMappingURL=index.js.map