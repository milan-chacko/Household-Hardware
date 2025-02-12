import express from 'express';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

const orderRouter = express.Router();

orderRouter.post('/', async (req, res) => {
  try {
    const { userId, user, cartItems, totals, paymentMethod } = req.body;

    const order = new Order({
      userId,
      user,
      cartItems,
      totals,
      paymentMethod,
      orderedAt: new Date()
    });

    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});


orderRouter.delete('/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('cartItems.productId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update product quantities
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        product.quantity += item.quantity; // Add back the ordered quantity
        await product.save();
      }
    }

    // Delete the order
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order deleted and stock updated successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

export default orderRouter;
