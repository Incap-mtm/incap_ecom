import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Gestión del Blog',
    description: 'Administrar los metadatos e índice de artículos del blog INCAP',
  });
  next();
};
