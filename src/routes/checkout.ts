import express from 'express'
import { getPaymentLink, paymentCancel, paymentSuccess } from '../controllers/checkout';

const checkoutRoutes = express.Router();

checkoutRoutes.get('/start',getPaymentLink );
checkoutRoutes.post('/success', paymentSuccess);
checkoutRoutes.post('/cancel', paymentCancel);

export default checkoutRoutes;