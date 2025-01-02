import initRequest from '@/core/middlewares/init-request';
import requestMethod from '@/core/middlewares/request-method';
import CancelOrRejectPaymentService from '@/modules/checkout/services/CancelOrRejectPaymentService';


export default requestMethod(
  'GET',
  initRequest( CancelOrRejectPaymentService.handle ) // eslint-disable-line comma-dangle
);
