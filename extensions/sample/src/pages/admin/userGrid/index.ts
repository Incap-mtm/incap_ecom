import { setContextValue } from '@evershop/evershop/graphql/services';

export default (request: any, _response: any, next: () => void) => {
  setContextValue(request, 'pageInfo', {
    title: 'Usuarios admin',
    description: 'Gestión de usuarios administradores'
  });
  next();
};
