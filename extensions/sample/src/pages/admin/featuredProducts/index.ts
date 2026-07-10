import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Productos destacados',
    description: 'Elegí los productos que aparecen en el carrusel de destacados del home'
  });
  next();
};
