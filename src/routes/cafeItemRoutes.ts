import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllCafeItems,
  getCafeItemById,
  createCafeItem,
  updateCafeItem,
  deleteCafeItem,
  getLowStockItems,
  getItemsByCategory
} from '../controllers/cafeItemController';
import { validateRequest } from '../middleware/validation';

const router: Router = Router();

// Validation rules
const cafeItemValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('quantity').optional().isNumeric().withMessage('Quantity must be a number'),
  body('category').optional().isString().withMessage('Category must be a string'),
  body('description').optional().isString().withMessage('Description must be a string'),
  body('inStock').optional().isBoolean().withMessage('In stock must be a boolean')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

const categoryValidation = [
  param('categoryName').notEmpty().withMessage('Category name is required')
];

// Cafe Items routes
router.get('/', getAllCafeItems);
router.get('/low-stock', getLowStockItems);
router.get('/category/:categoryName', categoryValidation, validateRequest, getItemsByCategory);
router.get('/:id', idValidation, validateRequest, getCafeItemById);
router.post('/', cafeItemValidation, validateRequest, createCafeItem);
router.put('/:id', [...idValidation, ...cafeItemValidation], validateRequest, updateCafeItem);
router.delete('/:id', idValidation, validateRequest, deleteCafeItem);

export default router;
