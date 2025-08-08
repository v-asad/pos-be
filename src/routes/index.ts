import { Router } from 'express';
import barGameRoutes from './barGameRoutes';
import cafeItemRoutes from './cafeItemRoutes';
import customerRoutes from './customerRoutes';
import membershipRoutes from './membershipRoutes';
import orderRoutes from './orderRoutes';

const router: Router = Router();

// API routes
router.use('/bar-games', barGameRoutes);
router.use('/cafe-items', cafeItemRoutes);
router.use('/customers', customerRoutes);
router.use('/memberships', membershipRoutes);
router.use('/orders', orderRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cafe and Bar Game Management System API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
