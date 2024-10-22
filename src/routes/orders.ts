import express from 'express'
import { deleteOrder, getOrderById, updateProductOnOrder } from '../controllers/order';

const orderRoutes = express.Router();

orderRoutes.post('/',updateProductOnOrder );
orderRoutes.get('/id/:order_id', getOrderById);
orderRoutes.delete('/:id', deleteOrder);

export default orderRoutes;