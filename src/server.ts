import express, { Request, Response } from 'express';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import adminRoutes from './routes/admin';
import orderRoutes from './routes/orders';
import { authAdminMiddleware, authMiddleware } from './middlewares/auth';
import dotenv from 'dotenv';
import checkoutRoutes from './routes/checkout';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/order", authMiddleware, orderRoutes);
app.use("/checkout", authMiddleware, checkoutRoutes);
app.use("/admin", authAdminMiddleware, adminRoutes);

// Resposta padrão para quaisquer outras requisições:
app.use((req: Request, res: Response) => {
    res.json("Route not exist").status(404);
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
