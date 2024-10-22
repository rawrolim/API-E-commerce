import express from 'express'
import {  getAllOrders, getOrdersByUser, createProduct, updateProduct, deleteProduct } from '../controllers/admin';

const adminRoutes = express.Router();

adminRoutes.get('/order/all',getAllOrders);
adminRoutes.get('/order/user/:id', getOrdersByUser);

adminRoutes.post('/product', createProduct );
adminRoutes.put('/product/:id',updateProduct);
adminRoutes.delete('/product/:id',deleteProduct);

export default adminRoutes;
