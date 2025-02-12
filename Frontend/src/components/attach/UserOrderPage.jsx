import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../cssf/UserOrderPage.css";
import styled from "styled-components";
import Footer from "../components/Footer";

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
      case "ORDER DELIVERED":
        return "status-delivered";
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
                {order.status != "ORDER REJECTED" && (
                  <button
                    className="view-details-button"
                    onClick={() => handleViewDetails(order._id)}
                  >
                    View Order Details
                  </button>
                )}
                {order.status === "ORDER PLACED" && (
                  <StyledWrapper>
                    <button
                      className="button"
                      type="button"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      <span className="button__text">Delete</span>
                      <span className="button__icon">
                        <svg
                          className="svg"
                          height={512}
                          viewBox="0 0 512 512"
                          width={512}
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title />
                          <path
                            d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 32,
                            }}
                          />
                          <line
                            style={{
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeMiterlimit: 10,
                              strokeWidth: 32,
                            }}
                            x1={80}
                            x2={432}
                            y1={112}
                            y2={112}
                          />
                          <path
                            d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 32,
                            }}
                          />
                          <line
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 32,
                            }}
                            x1={256}
                            x2={256}
                            y1={176}
                            y2={400}
                          />
                          <line
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 32,
                            }}
                            x1={184}
                            x2={192}
                            y1={176}
                            y2={400}
                          />
                          <line
                            style={{
                              fill: "none",
                              stroke: "#fff",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              strokeWidth: 32,
                            }}
                            x1={328}
                            x2={320}
                            y1={176}
                            y2={400}
                          />
                        </svg>
                      </span>
                    </button>
                  </StyledWrapper>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
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
  align: right;
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

const StyledWrapper = styled.div`
  .button {
    position: relative;
    border-radius: 6px;
    width: 150px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 1px solid #cc0000;
    background-color: #e50000;
    overflow: hidden;
  }

  .button,
  .button__icon,
  .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(35px);
    color: #fff;
    font-weight: 600;
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(109px);
    height: 100%;
    width: 39px;
    background-color: #cc0000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 20px;
  }

  .button:hover {
    background: #cc0000;
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 148px;
    transform: translateX(0);
  }

  .button:active .button__icon {
    background-color: #b20000;
  }

  .button:active {
    border: 1px solid #b20000;
  }
`;

export default UserOrderPage;
