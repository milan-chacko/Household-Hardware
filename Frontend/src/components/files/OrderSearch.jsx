import { useState, useEffect } from "react";
import axios from "axios";
import "../cssf/OrderSearch.css";
import { motion } from "framer-motion";

export default function OrderSearch() {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5555/filter/orders");
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orderId) {
      setFilteredOrders(orders.filter(order => order._id.includes(orderId)));
    } else {
      setFilteredOrders(orders);
    }
  }, [orderId, orders]);

  return (
    <div className="0order-search-container">
      <h2>Search Order</h2>
      <div className="iinput-wrapper">
        <motion.input
          whileFocus={{ scale: 1.05 }}
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="mm"
        />
      </div>
      {error && <p className="eerror-message">{error}</p>}
      <div className="order-cards">
        {filteredOrders.map((order) => (
          <motion.div 
            key={order._id} 
            className="oorder-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3>Order ID: {order._id}</h3>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Amount:</strong> ₹{order.totals.amount}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <h4>Items:</h4>
            <ul>
              {order.cartItems.map((item) => (
                <li key={item.productId._id} className="oorder-item">
                  {/* Display product image */}
                  {item.productId.productImage && (
                    <img 
                      src={`http://localhost:5555/${item.productId.productImage}`} 
                      alt={item.productId.productName} 
                      className="pproduct-image" 
                    />
                  )}
                  <span>{item.productId.productName} - {item.quantity} pcs</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
    
  );
}
