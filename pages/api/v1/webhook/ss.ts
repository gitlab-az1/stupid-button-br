import initRequest from '@/core/middlewares/init-request';
import requestMethod from '@/core/middlewares/request-method';
import HandleWebhookRequestService from '@/modules/stripe-integration/services/HandleWebhookRequestService';


export default requestMethod(
  'POST',
  initRequest( HandleWebhookRequestService.handle ) // eslint-disable-line comma-dangle
);
