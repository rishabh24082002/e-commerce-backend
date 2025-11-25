import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/order.js';
import analyticsRoutes from './routes/analytics.js';
import { requireAuth, requireRole } from './middlewares/requireAuth.js';


dotenv.config();


const app = express();
app.use(bodyParser.json());


app.use('/auth', authRoutes);
app.use('/products', productRoutes);

app.use('/orders', ordersRoutes);

app.use('/analytics', analyticsRoutes);


const port = process.env.PORT || 4000;
app.listen(port, () => {
console.log(`Server running on http://localhost:${port}`);
});