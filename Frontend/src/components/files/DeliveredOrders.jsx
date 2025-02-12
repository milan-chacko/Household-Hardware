import React, { useEffect, useState } from "react";
import axios from "axios";
import "../cssf/DeliveredOrder.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DeliveredOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5555/order/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching delivered orders:", error);
      }
    };

    fetchDeliveredOrders();
  }, []);

  return (
    <>
      <div className="header-container">
        <StyledButtonWrapper>
          <button onClick={() => navigate('/admin/dispatched-order')} className="back-button">
            <span className="button-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="20" fill="currentColor" className="back-icon" viewBox="0 0 16 16">
                <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1"/>
              </svg> Dispatched Orders
            </span>
          </button>
        </StyledButtonWrapper>
      </div>
      <div className="orders-container">
        {orders.length === 0 ? (
          <p className="no-orders-message">No delivered orders available.</p>
        ) : (
          <div className="orders-row">
            {orders.map((order) => (
              <div key={order._id} className="order-card-horizontal">
               <div className="my">
                <div className="order-status">Delivered</div>
                <div className="order-summary-horizontal">
                 
                  <div className="order-info">
                    <h2 className="product-title">{order.cartItems[0]?.productId.productName}</h2>
                    <p className="order-id">Order ID: {order._id}</p>
                    <p><strong>Customer:</strong> {order.userId.firstname} {order.userId.lastname}</p>
                    <p><strong>Address:</strong> {order.userId.address}</p>
                    <p><strong>Phone:</strong> {order.userId.phonenumber}</p>
                    <p className="total-amount">Total Amount: ₹{order.totals.amount}</p>
                  </div>
                  <div className="cart-items">
                    <h3>Cart Items</h3>
                    {order.cartItems.map((item) => (
                      <div key={item.productId._id} className="cart-item">
                        <div className="cart-item-image-container">
                          <img
                            src={`http://localhost:5555/${item.productId.productImage}`}
                            alt={item.productId.productName}
                            className="cart-item-image"
                          />
                        </div>
                        <div className="cart-item-info">
                          <p>{item.productId.productName}</p>
                          <p>Category: {item.productId.productCategory}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const StyledButtonWrapper = styled.div`
  .back-button {
    display: flex;
    align-items: center;
    background: #000;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .back-button:hover {
    background: #333;
  }

  .button-content {
    display: flex;
    align-items: center;
  }
`;

export default DeliveredOrders;