import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createOrder,
  getOrderById,
  addItemsToOrder,
  updateItemQuantity,
  removeItemsFromOrder,
  payForOrder,
  getAllOrders
} from '../controllers/orderController';
import { validateRequest } from '../middleware/validation';

const router: Router = Router();

// Validation rules
const orderValidation = [
  body('customerId').isMongoId().withMessage('Customer ID must be valid'),
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.itemId').isMongoId().withMessage('Item ID must be valid'),
  body('items.*.itemType').isIn(['CafeItem', 'GameSession']).withMessage('Item type must be CafeItem or GameSession'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const orderIdValidation = [
  param('orderId').isMongoId().withMessage('Order ID must be valid')
];

const itemIdValidation = [
  param('itemId').isMongoId().withMessage('Item ID must be valid')
];

const quantityValidation = [
  body('quantity').isNumeric().withMessage('Quantity must be a number')
];

const addItemsValidation = [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.itemId').isMongoId().withMessage('Item ID must be valid'),
  body('items.*.itemType').isIn(['CafeItem', 'GameSession']).withMessage('Item type must be CafeItem or GameSession'),
  body('items.*.quantity').isNumeric().withMessage('Quantity must be a number')
];

// Order routes
router.get('/', getAllOrders);
router.get('/:id', idValidation, validateRequest, getOrderById);
router.post('/', orderValidation, validateRequest, createOrder);
router.post('/:orderId/items', [...orderIdValidation, ...addItemsValidation], validateRequest, addItemsToOrder);
router.put('/:orderId/items/:itemId', [...orderIdValidation, ...itemIdValidation, ...quantityValidation], validateRequest, updateItemQuantity);
router.delete('/:orderId/items/:itemId', [...orderIdValidation, ...itemIdValidation], validateRequest, removeItemsFromOrder);
router.post('/:orderId/pay', orderIdValidation, validateRequest, payForOrder);

export default router;
