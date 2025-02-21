import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import "../cssf/CategoryProducts.css";
import BackButton from "../BackButton";

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5555/productget?category=${category}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [category]);

  const handleProductClick = (productId) => {
    navigate(`/product-detail?id=${productId}`);
  };

  return (
    <>
    <div className="products-page">
      <h1 className="h1">PRODUCTS IN {category}</h1>
      <BackButton/>
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="product-card"
              onClick={() => handleProductClick(product._id)}
            >
              {product.productImage && (
                <img
                  src={`http://localhost:5555/${product.productImage}`}
                  alt={product.productName}
                  className="product-image"
                />
              )}
              <h3>{product.productName}</h3>
              <p>Price: ₹{product.productPrice}</p>
 {product.quantity > 0 ? <p>Quantity:{product.quantity} </p>: <h4 className="stock">OUT OF STOCK</h4>}
              </div>
          ))
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
     
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
export default CategoryProducts;
