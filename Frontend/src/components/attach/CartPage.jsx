import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import '../cssf//CartPage.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setErrorMessage("You must be logged in to view your cart.");
      navigate("/signin");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/cart/${userId}`);
        setCartItems(response.data);
      } catch (error) {
        setErrorMessage("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, navigate]);

  const handleRemoveItem = async (productId, quantity, productName, productCategory) => {

    const isConfirmed = window.confirm(`Are you sure you want to remove ${productName} ${productCategory} from your cart?`);
    
    if (!isConfirmed) {
      return; 
    }

    try {
      // First, update the product quantity
      await axios.put(`http://localhost:5555/cart/updateStock/${productId}`, {
        quantity: quantity // This is the quantity to add back to stock
      });

      // Then, delete the cart item
      await axios.delete(`http://localhost:5555/cart/${userId}/${productId}`);

      // Update the cart items state to remove the deleted item
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
      alert("Item removed successfully!");
    } catch (error) {
      console.error("Error removing item:", error);
      setErrorMessage("Failed to remove item. Please try again.");
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleImageError = (event) => {
    event.target.src = '/placeholder-image.jpg'; // Replace with your placeholder image path
  };

  const calculateTotals = () => {
    return cartItems.reduce(
      (acc, item) => ({
        quantity: acc.quantity + item.quantity,
        amount: acc.amount + item.quantity * item.productId.productPrice,
      }),
      { quantity: 0, amount: 0 }
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading cart items...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="error-container">
        <p className="error-message">{errorMessage}</p>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <>
    <div className="cart-container">
      <div className="cart-main">
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image-container">
                  <img
                    src={`http://localhost:5555/${item.productId.productImage}`}
                    alt={item.productId.productName}
                    className="item-imagee"
                    onError={handleImageError}
                  />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.productId.productName}</h3>
                  <p className="item-category">{item.productId.productCategory}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-unit-price">₹{item.productId.productPrice} each</p>
                </div>
                <div className="item-actions">
                  <p className="item-total-price">₹{item.productId.productPrice * item.quantity}</p>
                  <StyledWrapper>
      <button className="Btn" onClick={() => handleRemoveItem(item.productId._id, item.quantity, item.productId.productName, item.productId.productCategory)}>
        <div className="sign">
          <svg viewBox="0 0 16 16" className="bi bi-trash3-fill" fill="currentColor" height={18} width={18} xmlns="http://www.w3.org/2000/svg">
            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
          </svg>
        </div>
        <div className="text">Delete</div>
      </button>
    </StyledWrapper>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-row">
          <span>TOTAL QUANTITY</span>
          <span>{totals.quantity}</span>
        </div>
        <div className="summary-row">
          <span>TOTAL AMOUNT</span>
          <span>₹{totals.amount}</span>
        </div>
      </div>

      <button 
  className={`checkout-button ${cartItems.length === 0 ? 'disabled' : ''}`}
  onClick={() =>
    navigate("/checkout", {
      state: { cartItems, totals },
    })
  }
  disabled={cartItems.length === 0}
>
  PROCEED TO PAY
</button>
    </div>
      <FooterWrapper>
      <p>&copy; {new Date().getFullYear()} Nadakkadavunkal Hardwares. All rights reserved.</p>
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

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background: rgb(255, 135, 65);
    background: linear-gradient(
      250deg,
      rgba(255, 135, 65, 1) 15%,
      rgba(255, 65, 65, 1) 65%
    );
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px, 2px);
  }`;

export default CartPage;