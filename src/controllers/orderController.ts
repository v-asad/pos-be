import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import CafeItem from '../models/CafeItem';
import Customer from '../models/Customer';
import GameSession from '../models/GameSession';

// Create new order
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, items } = req.body;

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(404).json({
        success: false,
        error: 'Customer not found'
      });
      return;
    }

    // Create order items
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const { itemId, itemType, quantity } = item;
      
      if (itemType === 'CafeItem') {
        const cafeItem = await CafeItem.findById(itemId);
        if (!cafeItem) {
          res.status(404).json({
            success: false,
            error: `Cafe item ${itemId} not found`
          });
          return;
        }
        
        if (cafeItem.quantity < quantity) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for ${cafeItem.name}`
          });
          return;
        }

        const orderItem = await OrderItem.create({
          item: itemId,
          itemType: 'CafeItem',
          quantity,
          priceAtSale: cafeItem.price
        });

        orderItems.push(orderItem._id);
        totalAmount += cafeItem.price * quantity;

        // Update stock
        cafeItem.quantity -= quantity;
        if (cafeItem.quantity === 0) {
          cafeItem.inStock = false;
        }
        await cafeItem.save();
      } else if (itemType === 'GameSession') {
        const gameSession = await GameSession.findById(itemId);
        if (!gameSession) {
          res.status(404).json({
            success: false,
            error: `Game session ${itemId} not found`
          });
          return;
        }

        const orderItem = await OrderItem.create({
          item: itemId,
          itemType: 'GameSession',
          quantity: 1,
          priceAtSale: gameSession.cost || 0,
          costAtSale: gameSession.cost
        });

        orderItems.push(orderItem._id);
        totalAmount += gameSession.cost || 0;
      }
    }

    // Create order
    const order = await Order.create({
      customer: customerId,
      items: orderItems,
      totalAmount
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

// Add items to order
export const addItemsToOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    let totalAmount = order.totalAmount;

    for (const item of items) {
      const { itemId, itemType, quantity } = item;
      
      if (itemType === 'CafeItem') {
        const cafeItem = await CafeItem.findById(itemId);
        if (!cafeItem) {
          res.status(404).json({
            success: false,
            error: `Cafe item ${itemId} not found`
          });
          return;
        }
        
        if (cafeItem.quantity < quantity) {
          res.status(400).json({
            success: false,
            error: `Insufficient stock for ${cafeItem.name}`
          });
          return;
        }

        const orderItem = await OrderItem.create({
          item: itemId,
          itemType: 'CafeItem',
          quantity,
          priceAtSale: cafeItem.price
        });

        order.items.push(orderItem._id as mongoose.Types.ObjectId);
        totalAmount += cafeItem.price * quantity;

        // Update stock
        cafeItem.quantity -= quantity;
        if (cafeItem.quantity === 0) {
          cafeItem.inStock = false;
        }
        await cafeItem.save();
      }
    }

    order.totalAmount = totalAmount;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add items to order'
    });
  }
};

// Update item quantity in order
export const updateItemQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;

    const orderItem = await OrderItem.findById(itemId);
    if (!orderItem) {
      res.status(404).json({
        success: false,
        error: 'Order item not found'
      });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    const quantityDiff = quantity - orderItem.quantity;
    orderItem.quantity = quantity;
    await orderItem.save();

    // Update order total
    order.totalAmount += quantityDiff * orderItem.priceAtSale;
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update item quantity'
    });
  }
};

// Remove items from order
export const removeItemsFromOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, itemId } = req.params;

    const orderItem = await OrderItem.findById(itemId);
    if (!orderItem) {
      res.status(404).json({
        success: false,
        error: 'Order item not found'
      });
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    // Remove item from order
    order.items = order.items.filter((item: any) => item.toString() !== itemId);
    order.totalAmount -= orderItem.priceAtSale * orderItem.quantity;
    await order.save();

    // Delete order item
    await OrderItem.findByIdAndDelete(itemId);

    const updatedOrder = await Order.findById(orderId)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to remove items from order'
    });
  }
};

// Pay for order
export const payForOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Order not found'
      });
      return;
    }

    if (order.paymentStatus === 'Paid') {
      res.status(400).json({
        success: false,
        error: 'Order is already paid'
      });
      return;
    }

    order.paymentStatus = 'Paid';
    await order.save();

    const updatedOrder = await Order.findById(orderId)
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process payment'
    });
  }
};

// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('customer')
      .populate({
        path: 'items',
        populate: {
          path: 'item',
          model: 'CafeItem'
        }
      });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};
