import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomerOrders,
  getCustomerGameSessions,
  assignMembership,
  linkMembership
} from '../controllers/customerController';
import { validateRequest } from '../middleware/validation';

const router: Router = Router();

// Validation rules
const customerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().withMessage('Email must be valid'),
  body('phone').optional().isString().withMessage('Phone must be a string'),
  body('membership').optional().isMongoId().withMessage('Membership must be a valid ID')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const searchValidation = [
  query('query').notEmpty().withMessage('Search query is required')
];

const membershipValidation = [
  body('membershipId').isMongoId().withMessage('Membership ID must be valid')
];

// Customer routes
router.get('/', getAllCustomers);
router.get('/search', searchValidation, validateRequest, searchCustomers);
router.get('/:id', idValidation, validateRequest, getCustomerById);
router.get('/:id/orders', idValidation, validateRequest, getCustomerOrders);
router.get('/:id/game-sessions', idValidation, validateRequest, getCustomerGameSessions);
router.post('/', customerValidation, validateRequest, createCustomer);
router.put('/:id', [...idValidation, ...customerValidation], validateRequest, updateCustomer);
router.put('/:id/assign-membership', [...idValidation, ...membershipValidation], validateRequest, assignMembership);
router.put('/:id/link-membership', [...idValidation, ...membershipValidation], validateRequest, linkMembership);
router.delete('/:id', idValidation, validateRequest, deleteCustomer);

export default router;
