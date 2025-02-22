import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../cssf/CheckoutPage.css";
import Footer from "../components/Footer";
import BackButton from "../BackButton";

const CheckoutPage = () => {
  const [user, setUser] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [totals, setTotals] = useState({ quantity: 0, amount: 0 });
  const [formData, setFormData] = useState({
    address: "",
    location: "",
    phonenumber: "",
    paymentMethod: "Cash on Delivery", // Default payment method
  });
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

  useEffect(() => {
    if (!userId) {
      navigate("/signin"); // Redirect to sign in if no userId
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/checkout?userId=${userId}`
        );
        setUser(response.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          address: response.data.address || "",
          location: response.data.location || "",
          phonenumber: response.data.phonenumber || "",
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const cartResponse = await axios.get(
          `http://localhost:5555/cart/${userId}`
        );
        setCartItems(cartResponse.data);

        const calculatedTotals = cartResponse.data.reduce(
          (acc, item) => ({
            quantity: acc.quantity + item.quantity,
            amount: acc.amount + item.quantity * item.productId.productPrice,
          }),
          { quantity: 0, amount: 0 }
        );

        setTotals(calculatedTotals);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchUserData();
    fetchCartItems();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure payment method is selected
    if (!formData.paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number validation
    if (!phoneRegex.test(formData.phonenumber)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    let finalAmount = totals.amount;

    // Add extra ₹50 if Cash on Delivery is selected
    if (
      formData.paymentMethod === "Cash on Delivery" ||
      formData.paymentMethod === "Online Payment"
    ) {
      finalAmount += 50;
    }

    // console.log('Form Data Submitted:', formData);
    // console.log('Final Total Amount:', finalAmount);

    const orderDetails = {
      user: formData,
      cartItems,
      totals: {
        ...totals,
        amount: finalAmount,
      },
    };

    try {
      await axios.put(`http://localhost:5555/checkout/user/${userId}`, {
        address: formData.address,
        location: formData.location,
        phonenumber: formData.phonenumber,
      });
    } catch (error) {
      console.error("Error updating user details:", error);
      alert("Failed to update your details. Please try again.");
      return; // Exit if updating fails
    }

    // Add submission logic here (e.g., send data to the server)
    alert(
      `Order confirmed! Payment Method: ${formData.paymentMethod}. Total Amount: ₹${finalAmount}.`
    );

    navigate("/order-summary", { state: { orderDetails } });
  };

  return (
    <>
      <div style={{ padding: "17px 0px 0px 5rem" }}>
        <BackButton />
      </div>
      <div className="checkout-container">
        {/* Display Cart Content */}
        <div className="cart-summary">
          <h3>Cart Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
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
              <div className="cart-totals">
                <p>
                  <strong>Total Quantity:</strong> {totals.quantity}
                </p>
                <p>
                  <strong>
                    Total Amount: ₹
                    {formData.paymentMethod === "Cash on Delivery"
                      ? totals.amount + 50
                      : totals.amount}
                  </strong>
                </p>
                {formData.paymentMethod === "Cash on Delivery" && (
                  <p className="extra-charge-note">
                    <em>Cash on Delivery adds ₹50 to your total.</em>
                  </p>
                )}
                {formData.paymentMethod === "Online Payment" && (
                  <p className="extra-charge-note">
                    <em>Online Delivery adds ₹50 to your total.</em>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Address and Payment Form */}
        <form className="f1" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Pickup Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter a pickup location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phonenumber">Phone Number:</label>
            <input
              type="text"
              id="phonenumber"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method:</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Pick at Shop">Pick at Shop</option>
              <option value="Online Payment">Online Payment</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Confirm and Pay
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
