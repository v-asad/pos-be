import { Request, Response } from 'express';
import Membership from '../models/Membership';

// Get all memberships
export const getAllMemberships = async (req: Request, res: Response): Promise<void> => {
  try {
    const memberships = await Membership.find();
    res.status(200).json({
      success: true,
      data: memberships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch memberships'
    });
  }
};

// Get single membership by ID
export const getMembershipById = async (req: Request, res: Response): Promise<void> => {
  try {
    const membership = await Membership.findById(req.params.id);
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch membership'
    });
  }
};

// Create new membership
export const createMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const membership = await Membership.create(req.body);
    res.status(201).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create membership'
    });
  }
};

// Update membership
export const updateMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update membership'
    });
  }
};

// Delete membership
export const deleteMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'Membership not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Membership deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete membership'
    });
  }
};
