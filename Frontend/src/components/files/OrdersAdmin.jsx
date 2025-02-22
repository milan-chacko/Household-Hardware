import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import '../cssf/OrdersAdmin.css';
import BackButton from "../BackButton";

const AdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rejecting, setRejecting] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5555/order/admin/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const dispatchOrder = async (orderId) => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:5555/order/admin/orders/${orderId}`);
      alert("The order has been accepted");
      const response = await axios.get("http://localhost:5555/order/admin/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const rejectOrder = async (orderId) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejecting the order.");
      return;
    }

    try {
      setUpdating(true);
      await axios.put(`http://localhost:5555/order/admin/orders/reject/${orderId}`, {
        rejectionReason,
      });
      alert("The order has been rejected.");
      const response = await axios.get("http://localhost:5555/order/admin/orders");
      setOrders(response.data);
      setRejecting(null);
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting the order:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <div style={{padding:"10px 0px 10px 3rem" }}>    <BackButton/>
    </div>
    <PageWrapper>
      <Container>
        <h1>Admin Orders</h1>
        <ButtonWrapper>
          <Button onClick={() => navigate("/admin/dispatched-order")}>Dispatched Order</Button>
        </ButtonWrapper>
        {updating && <p>Updating order status...</p>}
        {orders.length === 0 ? (
          <h2>No orders with status "ORDER CONFIRMED"</h2>
        ) : (
          <Grid>
            {orders.map((order) => (
              <Card key={order._id}>
                {/* Product images at the top */}
                <ProductContainer>
                  {order.cartItems.map((item) => (
                    <Product key={item.productId._id}>
                      <ProductImage src={`http://localhost:5555/${item.productId.productImage}`} alt={item.productId.productName} />
                    <div className="pp"><h2>{item.productId.productName} (x{item.quantity})</h2> </div>
                     
                    </Product>
                  ))}
                </ProductContainer>

                {/* Order details below the images */}
                <Details>
                  <h4 className="pp"><strong>Order ID:</strong> {order._id}</h4>
                  <h4 className="pp"><strong>Name:</strong> {order.userId.firstname} {order.userId.lastname}</h4>
                  <h4 className="pp"><strong>Address:</strong> {order.userId.address}</h4>
                  <h4 className="pp"><strong>Phone:</strong> {order.userId.phonenumber}</h4>
                  <h4 className="pp"><strong>Drop Location:</strong> {order.userId.location}</h4>
                  <h4 className="pp"><strong>Quantity:</strong> {order.totals.quantity}</h4>
                  <h4 className="pp"><strong>Amount:</strong> ₹{order.totals.amount}</h4>
                  <h4 className="pp"><strong>Status:</strong> {order.paymentMethod}</h4>
                </Details>

                {/* Action buttons at the bottom */}
                <ActionContainer>
                  <ActionButton onClick={() => dispatchOrder(order._id)} disabled={updating}>Dispatch Order</ActionButton>
                  <ActionButton reject onClick={() => setRejecting(order._id)} disabled={updating}>Reject Order</ActionButton>
                </ActionContainer>
                  <br></br>
                {rejecting === order._id && (
                  <Modal>
                    <textarea placeholder="Enter rejection reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                    <ButtonGroup>
                      <ModalButton onClick={() => rejectOrder(order._id)}>Confirm Reject</ModalButton>
                      <ModalButton onClick={() => setRejecting(null)}>Cancel</ModalButton>
                    </ButtonGroup>
                  </Modal>
                )}
              </Card>
            ))}
          </Grid>
        )}
      </Container>
    </PageWrapper>
    </>
  );
};

/* STYLES */

const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
`;

const Container = styled.div`
  flex: 1;
  background: #f8f9fa;
  padding: 2rem;
  min-height: 10vh;
  overflow-x: hidden;
  max-width:170vh;
  border-radius:20px;
`;

const ButtonWrapper = styled.div`
  margin-bottom: 1rem;
  display:flex;
  justify-content:right;
`;

const Button = styled.button`
  background: #007bff;
  color: white;
  padding: 1rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background: #0056b3;
    box-shadow: 0px 4px 10px rgba(0, 123, 255, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const Card = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

/* Product Images at the top */
const ProductContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const Product = styled.div``;

const ProductImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 5px;
  object-fit: cover;
`;

/* Order details below images */
const Details = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: left;
  padding: 0 1rem;
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
`;

const ActionButton = styled.button`
  background: ${({ reject }) =>
    reject
      ? "linear-gradient(135deg, #dc3545, #b02a37)"
      : "linear-gradient(135deg, #28a745, #1e7e34)"};
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ reject }) =>
      reject
        ? "linear-gradient(135deg, #b02a37, #891c25)"
        : "linear-gradient(135deg, #1e7e34, #155724)"};
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Modal = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  border-radius: 10px;
  min-width:20rem;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ModalButton = styled.button`
  background: linear-gradient(135deg, #6c757d, #495057);
  color: white;
  margin-top:1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: linear-gradient(135deg, #495057, #343a40);
    box-shadow: 0px 4px 12px rgba(108, 117, 125, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
export default AdminPage;
