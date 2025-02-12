import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import "../cssf/OrderDetailsPage.css";
import Footer from "../components/Footer";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/api/orders/${orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const determineStatus = () => {
    if (order.deliveredAt) return "Delivered";
    if (order.dispatchedAt) return "In Transit";
    if (order.orderedAt) return "Order Placed";
    return "Unknown";
  };

  const getTimelineStatus = (step) => {
    const status = determineStatus();
    switch (step) {
      case "Order Placed":
        return (
          status === "Order Placed" ||
          status === "In Transit" ||
          status === "Delivered"
        );
      case "In Transit":
        return status === "In Transit" || status === "Delivered";
      case "Delivered":
        return status === "Delivered";
      default:
        return false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <>
    <div className="order-details-container">
      <h2>Order Details</h2>
      <IoArrowBackCircleSharp size={50} onClick={()=>navigate('/user/orders')}/>
      <h3>Items:</h3>
      <ul className="item-list">
        {order.cartItems.map((item) => (
          <li key={item.productId._id} className="item">
            <img
              src={`http://localhost:5555/${item.productId.productImage}`}
              alt={item.productId.productName}
              className="item-image"
            />
            <div className="item-details">
              <p>
                <strong>{item.productId.productName}</strong> (x
                {item.quantity})
              </p>
              <p>₹{item.productId.productPrice} each</p>
              <p>Total: ₹{item.productId.productPrice * item.quantity}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="order-info">
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Order Date:</strong> {formatDate(order.orderedAt)}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Total Quantity:</strong> {order.totals.quantity}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{order.totals.amount}
        </p>

        {/* Order Tracking Widget */}
        <div className="order-tracking">
          <h3>ORDER TRACKING</h3>
          <div className="timeline">
            <div
              className={`timeline-step ${
                getTimelineStatus("Order Placed") ? "active" : ""
              }`}
            >
              <div className="icon">🛒</div>
              <p>Order Placed</p>
              {order.orderedAt && (
                <p className="timeline-date">{formatDate(order.orderedAt)}</p>
              )}
            </div>
            <div
              className={`timeline-connector ${
                getTimelineStatus("In Transit") ? "active" : ""
              }`}
            ></div>
            <div
              className={`timeline-step ${
                getTimelineStatus("In Transit") ? "active" : ""
              }`}
            >
              <div className="icon">🚚</div>
              <p>In Transit</p>
              {order.dispatchedAt && (
                <p className="timeline-date">
                  {formatDate(order.dispatchedAt)}
                </p>
              )}
            </div>
            <div
              className={`timeline-connector ${
                getTimelineStatus("Delivered") ? "active" : ""
              }`}
            ></div>
            <div
              className={`timeline-step ${
                getTimelineStatus("Delivered") ? "active" : ""
              }`}
            >
              <div className="icon">✅</div>
              <p>Delivered</p>
              {order.deliveredAt && (
                <p className="timeline-date">{formatDate(order.deliveredAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default OrderDetailsPage;
