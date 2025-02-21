import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../cssf/UserOrderPage.css";
import styled from "styled-components";
import Footer from "../components/Footer";
import BackButton from "../BackButton";

const UserOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5555/api/orders/user/${userId}`
          );
          setOrders(response.data);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/signin");
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ORDER PLACED":
        return "status-confirmed";
      case "ORDER DISPATCHED":
        return "status-dispatched";
      case "ORDER DELIVERD":
        return "status-delivered";
      case "ORDER REJECTED":
        return "status-rejected";
      default:
        return "";
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handleBillDetails = (orderId) => {
    navigate(`/order/${orderId}/bill`);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5555/orders/${orderId}`
      );
      if (response.status === 200) {
        alert("Order deleted successfully.");
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <p>View and manage your order history</p>
        </div>
        <div className="skeleton-container">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton skeleton-header"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text"></div>
              <div style={{ display: "flex", marginTop: "1.5rem" }}>
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-image"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: "17px 0px 0px 5rem" }}>
        {" "}
        <BackButton />
      </div>
      <div className="orders-container">
        <div className="orders-header">
          <h1>Your Orders</h1>
          <p>View and manage your order history</p>
        </div>

        {orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">🛍️</div>
            <p>You have no orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-carrd">
                <div className="order-header">
                  <div>
                    <h2 className={getStatusClass(order.status)}>
                      <strong>ORDER STATUS:</strong> {order.status}
                    </h2>

                    {/* Display rejection reason if order is rejected */}
                    {order.status === "ORDER REJECTED" && (
                      <div className="rejection-reason">
                        <strong>Reason for Rejection:</strong>{" "}
                        {order.rejectionReason || "Not specified"}
                      </div>
                    )}

                    {(order.status === "ORDER DISPATCHED" ||
                      order.status === "ORDER DELIVERD") && (
                      <BillButtonWrapper>
                        <StyledBillButton
                          onClick={() => handleBillDetails(order._id)}
                        >
                          View Bill
                        </StyledBillButton>
                      </BillButtonWrapper>
                    )}

                    <div className="order-id">Order ID: {order._id}</div>
                    <div className="order-date">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span>Quantity: {order.totals.quantity}</span>
                  </div>
                  <div className="detail-item">
                    <span>Payment: {order.paymentMethod}</span>
                  </div>
                  <div className="detail-item order-amount">
                    <span>₹{order.totals.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="product-gallery">
                  {order.cartItems.map((item) => (
                    <div
                      key={item.productId._id}
                      className="product-image-container"
                    >
                      <img
                        src={`http://localhost:5555/${item.productId.productImage}`}
                        alt={item.productId.productName}
                        className="product-image"
                      />
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  {order.status !== "ORDER REJECTED" && (
                    <button
                      className="view-details-button"
                      onClick={() => handleViewDetails(order._id)}
                    >
                      View Order Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

const BillButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const StyledBillButton = styled.button`
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  color: white;
  border: none;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 114, 255, 0.2);

  &:hover {
    background: linear-gradient(135deg, #0072ff, #00c6ff);
    box-shadow: 0 6px 8px rgba(0, 114, 255, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default UserOrderPage;
