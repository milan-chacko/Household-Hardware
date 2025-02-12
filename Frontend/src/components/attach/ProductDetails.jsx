import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../cssf/ProductDetails.css";
import Footer from "../components/Footer";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Debugging: log searchParams and productId
  const productId = searchParams.get("id");

  if (!productId) {
    setErrorMessage("Product ID is missing in the URL.");
    return;
  }

  const isAuthenticated = localStorage.getItem("auth") === "true";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleQuantityChange = (operation) => {
    if (operation === "increment") {
      if (quantity < product.quantity) {
        setQuantity((prev) => prev + 1);
        setErrorMessage("");
      } else {
        setErrorMessage("Cannot exceed available stock.");
      }
    } else {
      setQuantity((prev) => Math.max(prev - 1, 1));
      setErrorMessage("");
    }
  };

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
  
    // Ensure the product is fetched before proceeding
    if (!isAuthenticated) {
      setErrorMessage("You must be logged in to add products to the cart.");
      navigate("/signin");
      return;
    }
  
    if (!userId || !productId) {
      setErrorMessage("User ID or Product ID is missing.");
      return;
    }
  
    if (quantity > product.quantity) {
      setErrorMessage("Quantity exceeds available stock.");
      return;
    }
  
    // Use product.id directly from the fetched product data
    const payload = {
      userId,
      productId: productId, // Corrected to use product.id
      quantity,
    };
  
  
    setLoading(true); // Start loading
    try {
      const response = await axios.post("http://localhost:5555/cart", payload);
  
      if (response.status === 201) {
        setSuccessMessage("Product added to cart successfully!");
        setErrorMessage("");
  
        // Fetch updated product details
        const updatedProductResponse = await axios.get(
          `http://localhost:5555/products/${productId}`
        );
        setProduct(updatedProductResponse.data);
        const confirmVisitCart = window.confirm(
          "Product added to cart successfully! Do you want to visit your cart?"
        );
        if (confirmVisitCart) {
          navigate("/cart"); // Navigate to the cart page
        }
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setErrorMessage("Failed to add product to cart. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const totalPrice = product ? product.productPrice * quantity : 0;

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <>
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-container">
          {product.productImage && (
            <img
              src={`http://localhost:5555/${product.productImage}`}
              alt={product.productName}
              className="product-detail-image"
            />
          )}
        </div>
        <div className="product-info-container">
          <h1 className="product-name">{product.productName} - {product.productCategory}</h1>
          <p className="product-descriptionn">Category: {product.productCategory}</p>
          <p className="product-description">Description: {product.productDescription}</p>
          <p className="product-description">
            Available Quantity: {product.quantity}
          </p>
          <p className="product-price">Price: ₹{product.productPrice}</p>

          <div className="quantity-container">
            <button onClick={() => handleQuantityChange("decrement")}>-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantityChange("increment")}>+</button>
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <p className="total-price">Total: ₹{totalPrice}</p>

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={quantity > product.quantity || loading || product.quantity === 0}
          >
            {loading ? "Adding..." : product.quantity === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProductDetails;
