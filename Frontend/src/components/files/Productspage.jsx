import React, { useEffect, useState } from "react";
import "../cssf/ProductsPage.css";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]); // Holds the list of products
  const [isAddingProduct, setIsAddingProduct] = useState(false); // Toggles between product list and form
  const [categories, setCategories] = useState([]); // State for categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5555/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    productName: "",
    productPrice: "",
    productDescription: "",
    productImage: null,
    productCategory: "",
    quantity: "", // Add quantity field
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5555/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, []);

  const toggleView = () => {
    setIsAddingProduct((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "productImage") {
      const file = files[0];
      if (file) {
        setFormData((prevState) => ({
          ...prevState,
          productImage: file,
        }));
        console.log("Selected file:", file.name);
      } else {
        setFormData((prevState) => ({
          ...prevState,
          productImage: null,
        }));
        console.log("No file selected.");
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const {
      productName,
      productPrice,
      productDescription,
      productImage,
      productCategory,
      quantity,
    } = formData;

    if (!productName.trim()) {
      newErrors.productName = "Product name is required.";
    }
    if (
      !productPrice.trim() ||
      isNaN(productPrice) ||
      Number(productPrice) <= 0
    ) {
      newErrors.productPrice = "Enter a valid positive number for the price.";
    }
    if (!productDescription.trim()) {
      newErrors.productDescription = "Product description is required.";
    }
    if (!productCategory) {
      newErrors.productCategory = "Please select a product category.";
    }
    if (!quantity.trim() || isNaN(quantity) || Number(quantity) <= 0) {
      newErrors.quantity = "Enter a valid positive number for the quantity.";
    }
    if (!productImage) {
      newErrors.productImage = "Product image is required.";
    } else if (
      !["image/jpeg", "image/png", "image/gif"].includes(productImage.type)
    ) {
      newErrors.productImage = "Only JPG, PNG, and GIF formats are allowed.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("productName", formData.productName);
        formDataToSend.append("productPrice", formData.productPrice);
        formDataToSend.append("productDescription", formData.productDescription);
        formDataToSend.append("productCategory", formData.productCategory);
        formDataToSend.append("quantity", formData.quantity);
        if (formData.productImage) {
          formDataToSend.append("productImage", formData.productImage);
        }

        const response = await axios.post(
          "http://localhost:5555/products",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Product added successfully!");
        setIsAddingProduct(false);
        setFormData({
          productName: "",
          productPrice: "",
          productDescription: "",
          productImage: null,
          productCategory: "",
          quantity: "",
        });
        setErrors({});
        const updatedProducts = await axios.get("http://localhost:5555/products");
        setProducts(updatedProducts.data);
      } catch (error) {
        console.error("Error adding product:", error);
        alert("Failed to add product. Please try again.");
      }
    }
  };

  return (
    <div className="products-page">
      <header className="products-header">
        <h1>{isAddingProduct ? "Add Product" : "Products"}</h1>
        <button className="toggle-button" onClick={toggleView}>
          {isAddingProduct ? "Show Products" : "Add Product"}
        </button>
      </header>

      {isAddingProduct ? (
        <div className="add-product-form">
          <h2>Add a New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                id="productName"
                placeholder="Enter product name"
                value={formData.productName}
                onChange={handleChange}
              />
              {errors.productName && (
                <small className="error-message">{errors.productName}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="productPrice">Product Price</label>
              <input
                type="text"
                id="productPrice"
                placeholder="Enter product price"
                value={formData.productPrice}
                onChange={handleChange}
              />
              {errors.productPrice && (
                <small className="error-message">{errors.productPrice}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="productCategory">Product Category</label>
              <select
                id="productCategory"
                value={formData.productCategory}
                onChange={handleChange}
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.productCategory && (
                <small className="error-message">
                  {errors.productCategory}
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
              {errors.quantity && (
                <small className="error-message">{errors.quantity}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="productDescription">Product Description</label>
              <textarea
                id="productDescription"
                placeholder="Enter product description"
                value={formData.productDescription}
                onChange={handleChange}
              ></textarea>
              {errors.productDescription && (
                <small className="error-message">
                  {errors.productDescription}
                </small>
              )}
            </div>
            <div className="form-group">
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className="upload-button"
                onClick={() => document.getElementById("productImage").click()}
              >
                <span className="add-button">UPLOAD IMAGE</span>
              </button>
              {formData.productImage && (
                <div className="file-preview">
                  <p>Selected File: {formData.productImage.name}</p>
                  {formData.productImage.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(formData.productImage)}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>
              )}
              {errors.productImage && (
                <small className="error-message">{errors.productImage}</small>
              )}
            </div>
            <button type="submit" className="add-button">
              Add Product
            </button>
          </form>
        </div>
      ) : (
        <div className="product-list">
          <h2>Available Products</h2>
          <div className="products-container">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card">
                  <h3>{product.productName}</h3>
                  <p>Price: ₹{product.productPrice}</p>
                  <p>Category: {product.productCategory}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Description: {product.productDescription}</p>
                  {product.productImage && (
                    <img
                      src={`http://localhost:5555/${product.productImage}`}
                      alt={product.productName}
                      className="product-image"
                    />
                  )}
                </div>
              ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
