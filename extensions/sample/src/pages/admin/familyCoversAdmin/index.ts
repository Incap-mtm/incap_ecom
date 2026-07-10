import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Portadas de familia',
    description: 'Elegí la imagen de portada de cada familia de productos'
  });
  next();
};
