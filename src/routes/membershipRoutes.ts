import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership
} from '../controllers/membershipController';
import { validateRequest } from '../middleware/validation';

const router: Router = Router();

// Validation rules
const membershipValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('active').optional().isBoolean().withMessage('Active must be a boolean')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Membership routes
router.get('/', getAllMemberships);
router.get('/:id', idValidation, validateRequest, getMembershipById);
router.post('/', membershipValidation, validateRequest, createMembership);
router.put('/:id', [...idValidation, ...membershipValidation], validateRequest, updateMembership);
router.delete('/:id', idValidation, validateRequest, deleteMembership);

export default router;
