import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Orden de tamaños de variante',
    description: 'Define el orden de aparición de los tamaños en la ficha de producto'
  });
  next();
};
