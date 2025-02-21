import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoPrint, IoDownload } from "react-icons/io5";
import jsPDF from "jspdf";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import html2pdf from "html2pdf.js";
import styled from "styled-components";
import "../cssf/OrderBillPage.css"; // Import CSS for styling
import Footer from "../components/Footer";

const OrderBillPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const billRef = useRef();
const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/bill/${orderId}`
        );
        setOrder(response.data);

        // Fetch user details using userId from order data
        const userResponse = await axios.get(
          `http://localhost:5555/bill/users/${response.data.userId}`
        );
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderAndUser();
  }, [orderId]);

  // Function to trigger the print dialog
  const handlePrint = () => {
    window.print();
  };

  // Function to generate and download the PDF
  const handleDownloadPDF = () => {
    const element = billRef.current;

    const opt = {
      margin:       1,
      filename:     `Order_Bill_${orderId}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 4 },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
    };

    // Convert HTML content to PDF and download
    html2pdf().from(element).set(opt).save();
  };

  if (!order || !user) return <div className="loading">Loading...</div>;

  return (
    <>
    <div className="bill-container">
      <div ref={billRef} className="bill-content">
        <h2 className="bill-title">Order Invoice</h2>
          <IoArrowBackCircleSharp size={50} onClick={()=>navigate('/user/orders')}/>
        <div className="bill-header">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.orderedAt).toLocaleDateString()}
          </p>
        </div>

        <h3>Customer Details</h3>
        <div className="customer-details">
          <p>
            <strong>Name:</strong> {user.firstname} {user.lastname}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Contact:</strong> {user.phonenumber}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Location:</strong> {user.location}
          </p>
        </div>

        <h3>Order Details</h3>
        <table className="order-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.cartItems.map((item) => (
              <tr key={item.productId._id}>
                <td className="item-details">
                  <img
                    src={`http://localhost:5555/${item.productId.productImage}`}
                    alt={item.productId.productName}
                    className="product-image"
                  />
                  {item.productId.productName}
                </td>
                <td>{item.quantity}</td>
                <td>₹{item.productId.productPrice}</td>
                <td>₹{item.quantity * item.productId.productPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-amount">
          <h3>Total Amount: ₹{order.totals.amount}</h3>
        </div>
      </div>

      <button
        onClick={handlePrint}  // Trigger window.print() when clicked
        className="print-btn"
      >
        <IoPrint size={20} /> Print / Download
      </button>

      <button
        onClick={handleDownloadPDF}  // Trigger PDF download
        className="download-pdf-btn"
      >
       <StyledBillButton>  <IoDownload size={20} /> Download as PDF</StyledBillButton>
      </button>
    </div>
    <FooterWrapper>
     <p>&copy; {new Date().getFullYear()} Household Hardwares. All rights reserved.</p>
   </FooterWrapper>
    </>
  );
};

const FooterWrapper = styled.footer`
  width: 106%;
  background-color: #37474f;
  color: white;
  text-align: center;
  padding: 1rem 0;
  position: fixed;
  bottom: 0;

   p{
  color:#fff;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const StyledBillButton = styled.button`
  background: linear-gradient(135deg, #00c6ff, #0072ff);
  align: right;
  color: white;
  border: none;
  margin:10px 10px 10px 10px;
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

export default OrderBillPage;
