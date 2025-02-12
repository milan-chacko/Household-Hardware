import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is imported
import "../cssf/OrderSummaryPage.css"; // Add styling as needed
import Footer from "../components/Footer";

const OrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = location.state || {}; // Retrieve order details
  const [users, setUsers] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5555/api/users/${userId}`
          );
          setUsers([response.data]); // Wrap the user object in an array
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, []);

  if (!orderDetails) {
    return (
      <div>
        <h2>Order Summary</h2>
        <p>No order details available.</p>
        <button onClick={() => navigate("/")}>Go to Home</button>
      </div>
    );
  }

  const { user, cartItems, totals } = orderDetails;
  const deliveryCharge = 50; // Fixed delivery charge
  const finalAmount = totals.amount;

  const handleConfirmAndPay = async () => {
    const userId = localStorage.getItem("userId");

    const payload = {
      userId,
      user: users[0], // Assuming user details are fetched correctly
      cartItems: orderDetails.cartItems,
      totals: { ...orderDetails.totals, amount: finalAmount }, // Keep existing structure
      paymentMethod: orderDetails.user.paymentMethod,
    };

    try {
      const response = await axios.post(
        "http://localhost:5555/orders",
        payload
      );
      if (response.status === 201) {
        alert("Order placed successfully");

        // Clear the user's cart
        await axios.delete(`http://localhost:5555/cart/${userId}`);

        navigate("/user/orders"); // Navigate to confirmation page
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place the order. Please try again.");
    }
  };

  const handleOnlinePayment = async () => {
    const userId = localStorage.getItem("userId");

    if (users.length === 0) {
      alert("User details are still loading. Please wait.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5555/api/payment/create-order",
        {
          amount: finalAmount, // Pass final amount with delivery charge
          currency: "INR",
        }
      );

      const { id: order_id, amount, currency } = response.data;

      const options = {
        key: "rzp_test_8zmjkLTpLxxEzq", // Replace with your Razorpay Key ID
        amount,
        currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id,
        handler: async function (response) {
          // After successful payment
          alert("✅ Payment Successful!");
          console.log(response.razorpay_payment_id);
          // Save order in backend
          const orderResponse = await axios.post(
            "http://localhost:5555/orders",
            {
              userId,
              cartItems: orderDetails.cartItems,
              totals: { ...orderDetails.totals, amount: finalAmount },
              paymentMethod: "Online Payment",
              paymentId: response.razorpay_payment_id,
            }
          );

          if (orderResponse.status === 201) {
            alert("✅ Order Placed Successfully!");
          }
          // Clear cart after payment
          await axios.delete(`http://localhost:5555/cart/${userId}`);

          navigate("/user/orders"); // Redirect to orders page
        },
        prefill: {
          name: users[0]?.firstname || "User",
          email: users[0]?.email || "user@example.com",
          contact: users[0]?.phonenumber || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true, // ✅ Force UPI payment option
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="order-summary-container">
        <div className="order-summary-content">
          <h2>Order Summary</h2>
          <div className="user-details">
            <h3>User Details</h3>
            {users.length > 0 ? (
              users.map((u) => (
                <p key={u._id}>
                  <strong>Name:</strong> {u.firstname} {u.lastname}
                </p>
              ))
            ) : (
              <p>Loading user details...</p>
            )}
            <p>
              <strong>Address:</strong> {user.address}
            </p>
            <p>
              <strong>Pickup Location:</strong> {user.location}
            </p>
            <p>
              <strong>Phone Number:</strong> {user.phonenumber}
            </p>
            <p>
              <strong>Payment Method:</strong> {user.paymentMethod}
            </p>
          </div>

          <div className="cart-details">
            <h3>Cart Details</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={`http://localhost:5555/${item.productId.productImage}`}
                  alt={item.productId.productName}
                  className="item-image"
                />
                <p>
                  <strong>{item.productId.productName}</strong> (
                  {item.productId.productCategory})
                </p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.productId.productPrice}</p>
                <p>Total: ₹{item.quantity * item.productId.productPrice}</p>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <h3>Order Totals</h3>
            <p>
              <strong>Total Quantity:</strong> {totals.quantity}
            </p>
            {user.paymentMethod !== "Pick at Shop" && (
              <p>
                <strong>Delivery Charge:</strong> ₹{deliveryCharge}
              </p>
            )}
            <p>
              <strong>Subtotal:</strong> ₹{totals.amount}
            </p>
            <p>
              <strong>Final Amount:</strong> ₹{finalAmount}
            </p>
          </div>

          {/* Conditional Rendering for Payment Method */}
          {user.paymentMethod === "Online Payment" ? (
            <button className="online-pay" onClick={handleOnlinePayment}>
              Pay Online
            </button>
          ) : (
            <>
              <button className="confirm-pay" onClick={handleConfirmAndPay}>
                Confirm and Pay
              </button>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSummaryPage;
