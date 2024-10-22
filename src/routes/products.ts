import express from 'express'
import { getProduct, getAllProducts } from '../controllers/product';

const productRoutes = express.Router();

productRoutes.get('/', getProduct);
productRoutes.get('/all', getAllProducts);

export default productRoutes;