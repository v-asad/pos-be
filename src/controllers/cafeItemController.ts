import { Request, Response } from 'express';
import CafeItem from '../models/CafeItem';

// Get all cafe items
export const getAllCafeItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafeItems = await CafeItem.find();
    res.status(200).json({
      success: true,
      data: cafeItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cafe items'
    });
  }
};

// Get single cafe item by ID
export const getCafeItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafeItem = await CafeItem.findById(req.params.id);
    if (!cafeItem) {
      res.status(404).json({
        success: false,
        error: 'Cafe item not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: cafeItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cafe item'
    });
  }
};

// Create new cafe item
export const createCafeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafeItem = await CafeItem.create(req.body);
    res.status(201).json({
      success: true,
      data: cafeItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create cafe item'
    });
  }
};

// Update cafe item
export const updateCafeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafeItem = await CafeItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!cafeItem) {
      res.status(404).json({
        success: false,
        error: 'Cafe item not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: cafeItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update cafe item'
    });
  }
};

// Delete cafe item
export const deleteCafeItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const cafeItem = await CafeItem.findByIdAndDelete(req.params.id);
    if (!cafeItem) {
      res.status(404).json({
        success: false,
        error: 'Cafe item not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Cafe item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete cafe item'
    });
  }
};

// Get low stock items
export const getLowStockItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const lowStockItems = await CafeItem.find({
      $or: [
        { quantity: { $lt: 10 } },
        { inStock: false }
      ]
    });
    
    res.status(200).json({
      success: true,
      data: lowStockItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch low stock items'
    });
  }
};

// Get items by category
export const getItemsByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryName } = req.params;
    const items = await CafeItem.find({ category: categoryName });
    
    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items by category'
    });
  }
};
