import initRequest from '@/core/middlewares/init-request';
import requestMethod from '@/core/middlewares/request-method';
import CreateCheckoutSessionService from '@/modules/checkout/services/CreateCheckoutSessionService';


export default requestMethod(
  'PUT',
  initRequest( CreateCheckoutSessionService.handle ) // eslint-disable-line comma-dangle
);
