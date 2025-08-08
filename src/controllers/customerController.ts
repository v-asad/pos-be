import { Request, Response } from 'express';
import Customer from '../models/Customer';
import Order from '../models/Order';
import GameSession from '../models/GameSession';
import Membership from '../models/Membership';

// Get all customers
export const getAllCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await Customer.find().populate('membership');
    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customers'
    });
  }
};

// Get single customer by ID
export const getCustomerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findById(req.params.id).populate('membership');
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer'
    });
  }
};

// Create new customer
export const createCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create customer'
    });
  }
};

// Update customer
export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update customer'
    });
  }
};

// Delete customer
export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete customer'
    });
  }
};

// Search customers
export const searchCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
      return;
    }

    const customers = await Customer.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).populate('membership');

    res.status(200).json({
      success: true,
      data: customers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search customers'
    });
  }
};

// Get customer orders
export const getCustomerOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ customer: req.params.id })
      .populate('items')
      .populate('customer');
    
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer orders'
    });
  }
};

// Get customer game sessions
export const getCustomerGameSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const gameSessions = await GameSession.find({ customer: req.params.id })
      .populate('game')
      .populate('customer');
    
    res.status(200).json({
      success: true,
      data: gameSessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer game sessions'
    });
  }
};

// Assign membership to customer
export const assignMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { membershipId } = req.body;
    const customerId = req.params.id;

    // Check if membership exists
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'Membership not found'
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

    customer.membership = membershipId;
    await customer.save();

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to assign membership'
    });
  }
};

// Link anonymous customer to membership
export const linkMembership = async (req: Request, res: Response): Promise<void> => {
  try {
    const { membershipId } = req.body;
    const customerId = req.params.id;

    // Check if membership exists
    const membership = await Membership.findById(membershipId);
    if (!membership) {
      res.status(404).json({
        success: false,
        error: 'Membership not found'
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

    // Link customer to membership
    customer.membership = membershipId;
    await customer.save();

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to link membership'
    });
  }
};
