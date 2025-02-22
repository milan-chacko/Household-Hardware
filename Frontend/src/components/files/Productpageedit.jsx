import React,{ useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../cssf/ProductPage.css";
import BackButton from "../BackButton";

const Productpageedit = () => {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const [editProductId, setEditProductId] = useState(null); // Track the product being edited
    const [editFormData, setEditFormData] = useState({});
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
  
    const handleEditClick = (product) => {
      setEditProductId(product._id);
      setEditFormData({
        productPrice: product.productPrice,
        productDescription: product.productDescription,
        quantity: product.quantity,
      });
    };
  
    const handleEditChange = (e) => {
      const { name, value } = e.target;
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        await axios.put(
          `http://localhost:5555/products/${editProductId}`,
          editFormData
        );
        setProducts((prev) =>
          prev.map((product) =>
            product._id === editProductId
              ? { ...product, ...editFormData }
              : product
          )
        );
        setEditProductId(null);
        alert("Product updated successfully!");
      } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product.");
      }
    };
  
    const handleCancelEdit = () => {
      setEditProductId(null);
      setEditFormData({});
    };
  
    const handleDeleteClick = async (productId) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
        try {
          await axios.delete(`http://localhost:5555/products/${productId}`);
          setProducts((prev) => prev.filter((product) => product._id !== productId));
          alert("Product deleted successfully!");
        } catch (error) {
          console.error("Error deleting product:", error);
          alert("Failed to delete product.");
        }
      }
    };
  
    return (
      <div className="products-page">
        <h1>Products in {category}</h1>
        <div style={{ padding: "0px 0px 0px 1rem" }}>
        {" "}
        <BackButton/>
      </div>
        <div className="products-container">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                {product.productImage && (
                  <img
                    src={`http://localhost:5555/${product.productImage}`}
                    alt={product.productName}
                    className="product-image"
                  />
                )}
                <h3>{product.productName}</h3>
                <p>Price: ₹{product.productPrice}</p>
                <p>Quantity: {product.quantity}</p>
                <p>{product.productDescription}</p>
                {editProductId === product._id ? (
                  <form className="edit-form" onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      name="productPrice"
                      value={editFormData.productPrice}
                      onChange={handleEditChange}
                      placeholder="Product Price"
                      required
                    />
                    <input
                      type="text"
                      name="quantity"
                      value={editFormData.quantity}
                      onChange={handleEditChange}
                      placeholder="Quantity"
                      required
                    />
                    <textarea
                      name="productDescription"
                      value={editFormData.productDescription}
                      onChange={handleEditChange}
                      placeholder="Product Description"
                      required
                    ></textarea>
                    <button type="submit" className="save-button">
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="action-buttons">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </div>
    );
  };

export default Productpageedit