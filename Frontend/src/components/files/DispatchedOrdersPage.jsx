import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import "../cssf/DispatchedOrders.css";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";

const DispatchedOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch orders with status "ORDER DISPATCHED" on component mount
  useEffect(() => {
    const fetchDispatchedOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5555/order/admin/dispatched-orders"
        );
        const dispatchedOrders = response.data.filter(
          (order) => order.status === "ORDER DISPATCHED"
        );
        setOrders(dispatchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDispatchedOrders();
  }, []);

  // Handle updating order status

  const handleOrderDelivered = async (orderId) => {
    setLoading(true);

    const isConfirm = window.confirm("Does the order is delivered?");
    if (!isConfirm) {
      return;
    }
    try {
      const response = await axios.patch(
        `http://localhost:5555/order/admin/update-status/${orderId}`,
        { status: "ORDER DELIVERD" }
      );

      if (response.status === 200) {
        alert("Order marked as delivered successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{padding:"17px 0px 0px 5rem" }}>    <BackButton/>
      </div>
      <h1>Dispatched Orders</h1>
      <div className="div2">
        <StyledWWrapper>
          <button onClick={() => navigate("/admin/orders")}>
            <span className="button_top">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="20"
                fill="currentColor"
                class="bi bi-arrow-left-square-fill"
                viewBox="0 0 16 16"
              >
                <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1" />
              </svg>{" "}
              New Orders
            </span>
          </button>
        </StyledWWrapper>

        <StyledWRrapper>
          <button onClick={() => navigate("/admin/delivered-orders")}>
            <svg
              height={24}
              width={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                fill="currentColor"
              />
            </svg>
            <span>Delivered Order</span>
          </button>
        </StyledWRrapper>
      </div>
      {orders.length === 0 ? (
        <p>No orders with status "ORDER DISPATCHED"</p>
      ) : (
        <StyledWrapper>
          {orders.map((order) => (
            <div className="card" key={order._id}>
              <div className="card__img">
                {order.cartItems.map((item) => (
                  <div key={item.productId._id}>
                    <img
                      className="card__img"
                      src={`http://localhost:5555/${item.productId.productImage}`}
                      alt={item.productId.name}
                    />
                    (x{item.quantity}) {item.productId.productName}{" "}
                    <h3 style={{ textAlign: "center" }}>
                      {item.productId.productname}{" "}
                      {item.productId.productcategory}
                    </h3>
                    <span>{item.productId.name}</span>
                  </div>
                ))}
              </div>
              <br></br>
              <div className="card__title">
                <strong>Order ID:</strong> {order._id}
              </div>
              <div className="card__subtitle">
                <strong>Name:</strong> {order.userId.firstname}{" "}
                {order.userId.lastname}
              </div>
              <div className="card__subtitle">
                <strong>Quantity:</strong> {order.totals.quantity}
              </div>
              <div className="card__subtitle">
                <strong>Amount:</strong> ₹{order.totals.amount}
              </div>
              <div className="card__subtitle">
                <strong>Address:</strong> {order.userId.address}
              </div>
              <div className="card__subtitle">
                <strong>Phone:</strong> {order.userId.phonenumber}
              </div>
              <div className="card__subtitle">
                <strong>Drop Location:</strong> {order.userId.location}
              </div>
              <div className="card__subtitle">
                <strong>Status:</strong> {order.paymentMethod}
              </div>
              <div className="card__wrapper">
                <button
                  className="card__btn"
                  onClick={() => handleOrderDelivered(order._id)}
                  disabled={order.status === "ORDER DELIVERD"}
                >
                  {order.status === "ORDER DELIVERD"
                    ? "DELIVERED"
                    : "MARK AS DELIVERED"}
                </button>
              </div>
            </div>
          ))}
        </StyledWrapper>
      )}
    </div>
  );
};
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  align-items: center;

  .card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    padding: 12px 20px;
    transition: transform 0.2s ease-in-out;
  }

  .card:hover {
    transform: translateY(-3px);
  }

  .card__img img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    margin-right: 20px;
  }

  .card__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    flex-grow: 1;
  }

  .card__title {
    font-size: 0px;
    font-weight: bold;
    color: #333;
  }

  .card__subtitle {
    font-size: 20px;
    color: #666;
  }

  .card__btn-container {
    margin-left: auto;
  }

  .card__btn {
    background-color: #BAC8CD;
    color: white;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .card__btn:hover {
    background-color: #0056b3;
  }

  .card__btn[disabled] {
    background-color: #bbb;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .card {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 15px;
    }

    .card__img img {
      width: 80px;
      height: 80px;
      margin-bottom: 10px;
    }

    .card__content {
      flex-direction: column;
      gap: 10px;
    }
  }
`;

const StyledWWrapper = styled.div`
  button {
    /* Variables */
    --button_radius: 0.75em;
    --button_color: #e8e8e8;
    --button_outline_color: #000000;
    font-size: 17px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: var(--button_radius);
    background: var(--button_outline_color);
  }

  .button_top {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    border: 2px solid var(--button_outline_color);
    border-radius: var(--button_radius);
    padding: 0.75em 1.5em;
    background: var(--button_color);
    color: var(--button_outline_color);
    transform: translateY(-0.2em);
    transition: transform 0.1s ease;
  }

  button:hover .button_top {
    /* Pull the button upwards when hovered */
    transform: translateY(-0.33em);
  }

  button:active .button_top {
    /* Push the button downwards when pressed */
    transform: translateY(0);
  }
`;

const StyledWRrapper = styled.div`
  button {
    display: flex;
    align-items: right;
    font-family: inherit;
    cursor: pointer;
    font-weight: 500;
    font-size: 17px;
    padding: 0.8em 1.3em 0.8em 0.9em;
    color: white;
    background: #ad5389;
    background: linear-gradient(to right, #0f0c29, #302b63, #24243e);
    border: none;
    letter-spacing: 0.05em;
    border-radius: 16px;
  }

  button svg {
    margin-right: 3px;
    transform: rotate(30deg);
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button span {
    transition: transform 0.5s cubic-bezier(0.76, 0, 0.24, 1);
  }

  button:hover svg {
    transform: translateX(5px) rotate(90deg);
  }

  button:hover span {
    transform: translateX(7px);
  }
`;
export default DispatchedOrdersPage;
