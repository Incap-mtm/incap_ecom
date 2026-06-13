import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Guía de uso',
    description: 'Cómo administrar el sitio'
  });
  next();
};
