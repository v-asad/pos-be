import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllBarGames,
  getBarGameById,
  createBarGame,
  updateBarGame,
  deleteBarGame,
  checkInToGame,
  checkOutOfGame,
  getActiveGameSessions,
  getPastGameSessions,
  updateGameSession,
  deleteGameSession
} from '../controllers/barGameController';
import { validateRequest } from '../middleware/validation';

const router: Router = Router();

// Validation rules
const barGameValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('pricePerHour').isNumeric().withMessage('Price per hour must be a number'),
  body('available').optional().isBoolean().withMessage('Available must be a boolean'),
  body('description').optional().isString().withMessage('Description must be a string')
];

const checkInValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required')
];

const idValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

// Bar Games routes
router.get('/', getAllBarGames);
router.get('/:id', idValidation, validateRequest, getBarGameById);
router.post('/', barGameValidation, validateRequest, createBarGame);
router.put('/:id', [...idValidation, ...barGameValidation], validateRequest, updateBarGame);
router.delete('/:id', idValidation, validateRequest, deleteBarGame);

// Check in/out routes
router.post('/:id/check-in', [...idValidation, ...checkInValidation], validateRequest, checkInToGame);
router.put('/game-sessions/:id/check-out', idValidation, validateRequest, checkOutOfGame);

// Game sessions routes
router.get('/game-sessions/active', getActiveGameSessions);
router.get('/game-sessions/past', getPastGameSessions);
router.put('/game-sessions/:id', idValidation, validateRequest, updateGameSession);
router.delete('/game-sessions/:id', idValidation, validateRequest, deleteGameSession);

export default router;
