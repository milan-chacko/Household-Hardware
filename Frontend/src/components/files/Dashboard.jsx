import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signout } from "./Auth-api";
import Authapi from "../../utils/Authapi";
import "../cssf/Dashboard.css";
import UsersPage from "./Userlists";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const Dashboard = () => {
  const authApi = React.useContext(Authapi);
  const navigate = useNavigate();
  const firstname = localStorage.getItem("firstname"); // Retrieve firstname from localStorage

  const handleClickNewOrder = () => {
    navigate("/admin/orders");
  };

  const handleClickDispatchedOrder = () => {
    navigate("/admin/dispatched-order");
  };

  const handleClickDeliveredOrder = () => {
    navigate("/admin/delivered-orders");
  };
  // State to store order counts
  const [ordersCount, setOrdersCount] = useState({
    newOrders: 0,
    dispatchedOrders: 0,
    deliveredOrders: 0,
  });

  useEffect(() => {
    // console.log("LocalStorage auth:", localStorage.getItem("auth"));
    // console.log("LocalStorage firstname:", localStorage.getItem("firstname"));

    const isAuthenticated = localStorage.getItem("auth");
    if (!isAuthenticated) {
      navigate("/signin");
    }

    // Fetch the order counts when component mounts
    fetchOrderCounts();
  }, [navigate]);

  // Fetch the order counts from the backend
  const fetchOrderCounts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5555/order/api/orders/count"
      ); // Make sure the URL matches your backend
      const data = await response.json();

      // Update the state with the fetched data
      setOrdersCount({
        newOrders: data.newOrders,
        dispatchedOrders: data.dispatchedOrders,
        deliveredOrders: data.deliveredOrders,
      });
    } catch (error) {
      console.error("Failed to fetch order counts:", error);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await signout();
      authApi.setAuth(res.data.auth);
      localStorage.removeItem("auth");
      localStorage.removeItem("firstname");
      navigate("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Use Sidebar as a reusable component */}
      <Sidebar firstname={firstname} handleLogout={handleLogout} />

      {/* Main Content */}
      <main className="main-content">
        <h1>Dashboard</h1>
        <div className="order-stats">
          <div className="order-box">
            <StyledWrapper>
              <div className="flip-card" onClick={handleClickNewOrder}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <p className="title"> {ordersCount.newOrders}</p>
                    <p>New Orders</p>
                  </div>
                  <div className="flip-card-back">
                    <p className="title"> {ordersCount.newOrders}</p>
                    <p className="pstyle">Click To View New Orders</p>
                    {/* <button >View New Orders</button>                   */}
                  </div>
                </div>
              </div>
            </StyledWrapper>
          </div>
          <div className="order-box">
            <StyledWrapper>
              <div className="flip-card" onClick={handleClickDispatchedOrder}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <p className="title"> {ordersCount.dispatchedOrders}</p>
                    <p>Dispatched Orders</p>
                  </div>
                  <div className="flip-card-back">
                    <p className="title"> {ordersCount.dispatchedOrders}</p>
                    <p className="pstyle">Click To View Dispatched Orders</p>
                  </div>
                </div>
              </div>
            </StyledWrapper>
          </div>
          <div className="order-box">
            <StyledWrapper>
              <div className="flip-card" onClick={handleClickDeliveredOrder}>
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <p className="title"> {ordersCount.deliveredOrders}</p>
                    <p>Delivered Orders</p>
                  </div>
                  <div className="flip-card-back">
                    <p className="title"> {ordersCount.deliveredOrders}</p>
                    <p className="pstyle">Click To View Delivered Orders</p>
                  </div>
                </div>
              </div>
            </StyledWrapper>
          </div>
        </div>

        {/* Users Page */}
        <UsersPage />
      </main>
    </div>
  );
};

const StyledWrapper = styled.div`
  .flip-card {
    background-color: transparent;
    width: 190px;
    height: 254px;
    perspective: 1000px;
    font-family: sans-serif;
  }

  .title {
    font-size: 1.5em;
    font-weight: 900;
    text-align: center;
    margin: 0;
  }

  .flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }

  .flip-card-front,
  .flip-card-back {
    box-shadow: 0 8px 14px 0 rgba(0, 0, 0, 0.2);
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    border: 1px solid coral;
    border-radius: 1rem;
  }

  .flip-card-front {
    background: linear-gradient(
      120deg,
      bisque 60%,
      rgb(255, 231, 222) 88%,
      rgb(255, 211, 195) 40%,
      rgba(255, 127, 80, 0.603) 48%
    );
    color: coral;
  }

  .flip-card-back {
    background: white;
    color: white;
    transform: rotateY(180deg);
  }
`;

export default Dashboard;
