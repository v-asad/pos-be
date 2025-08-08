import { Request, Response } from 'express';
import BarGame from '../models/BarGame';
import GameSession from '../models/GameSession';
import Customer from '../models/Customer';

// Get all bar games
export const getAllBarGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const barGames = await BarGame.find();
    res.status(200).json({
      success: true,
      data: barGames
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bar games'
    });
  }
};

// Get single bar game by ID
export const getBarGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const barGame = await BarGame.findById(req.params.id);
    if (!barGame) {
      res.status(404).json({
        success: false,
        error: 'Bar game not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: barGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bar game'
    });
  }
};

// Create new bar game
export const createBarGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const barGame = await BarGame.create(req.body);
    res.status(201).json({
      success: true,
      data: barGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create bar game'
    });
  }
};

// Update bar game
export const updateBarGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const barGame = await BarGame.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!barGame) {
      res.status(404).json({
        success: false,
        error: 'Bar game not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: barGame
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update bar game'
    });
  }
};

// Delete bar game
export const deleteBarGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const barGame = await BarGame.findByIdAndDelete(req.params.id);
    if (!barGame) {
      res.status(404).json({
        success: false,
        error: 'Bar game not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Bar game deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete bar game'
    });
  }
};

// Check in to a game
export const checkInToGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.body;
    const gameId = req.params.id;

    // Check if game exists and is available
    const game = await BarGame.findById(gameId);
    if (!game || !game.available) {
      res.status(400).json({
        success: false,
        error: 'Game not available'
      });
      return;
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Check if customer is already in an active session
    const activeSession = await GameSession.findOne({
      customer: customerId,
      endTime: null
    });

    if (activeSession) {
      res.status(400).json({
        success: false,
        error: 'Customer is already in an active game session'
      });
      return;
    }

    // Create new game session
    const gameSession = await GameSession.create({
      game: gameId,
      customer: customerId,
      startTime: new Date()
    });

    res.status(201).json({
      success: true,
      data: gameSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check in to game'
    });
  }
};

// Check out of a game session
export const checkOutOfGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessionId = req.params.id;
    const gameSession = await GameSession.findById(sessionId);

    if (!gameSession) {
      res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
      return;
    }

    if (gameSession.endTime) {
      res.status(400).json({
        success: false,
        error: 'Game session already ended'
      });
      return;
    }

    const endTime = new Date();
    const startTime = new Date(gameSession.startTime);
    const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    // Get game price per hour
    const game = await BarGame.findById(gameSession.game);
    const cost = game ? durationHours * game.pricePerHour : 0;

    gameSession.endTime = endTime;
    gameSession.cost = cost;
    await gameSession.save();

    res.status(200).json({
      success: true,
      data: gameSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check out of game'
    });
  }
};

// Get active game sessions
export const getActiveGameSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeSessions = await GameSession.find({ endTime: null })
      .populate('game')
      .populate('customer');
    
    res.status(200).json({
      success: true,
      data: activeSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active game sessions'
    });
  }
};

// Get past game sessions
export const getPastGameSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const pastSessions = await GameSession.find({ endTime: { $ne: null } })
      .populate('game')
      .populate('customer');
    
    res.status(200).json({
      success: true,
      data: pastSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch past game sessions'
    });
  }
};

// Update game session
export const updateGameSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameSession = await GameSession.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!gameSession) {
      res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: gameSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update game session'
    });
  }
};

// Delete game session
export const deleteGameSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameSession = await GameSession.findByIdAndDelete(req.params.id);
    
    if (!gameSession) {
      res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Game session deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete game session'
    });
  }
};
