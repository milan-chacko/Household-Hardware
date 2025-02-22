import React, { useState, useEffect } from "react";
import "../cssf/AddCategories.css";
import styled from "styled-components";
import axios from "axios";
import BackButton from "../BackButton";

const AddCategoryPage = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For storing image preview URL
  const [categories, setCategories] = useState([]); // For displaying existing categories
  const [message, setMessage] = useState("");

  // Fetch existing categories
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

  // Handle form submission
  const handleAddCategory = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", categoryName);
    formData.append("description", categoryDescription);
    if (categoryImage) formData.append("image", categoryImage);

    try {
      const response = await axios.post(
        "http://localhost:5555/categories",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Category added successfully!");
      setCategories([...categories, response.data]);
      setCategoryName("");
      setCategoryDescription("");
      setCategoryImage(null);
      setImagePreview(null); // Reset the image preview after submission
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Failed to add category. Please try again.");
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5555/categories/${id}`);
      setMessage("Category deleted successfully!");
      setCategories(categories.filter((category) => category._id !== id)); // Update the UI
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Failed to delete category. Please try again.");
    }
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a preview URL
    }
  };

  return (
    <>  <div style={{ padding: "17px 0px 15px 3px" }}>
    {" "}
    <BackButton />
  </div>
    <div className="add-category-page">
      <h1>ADD CATEGORY</h1>
      <form onSubmit={handleAddCategory} className="category-form">
        <div className="form-group">
          <label htmlFor="categoryName">Category Name</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryDescription">Category Description</label>
          <textarea
            id="categoryDescription"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="categoryImage">Category Image</label>
          <StyledWrapper>
            <label className="custum-file-upload" htmlFor="file">
              <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    fill="rgba(75, 85, 99, 1)"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                  />
                </svg>
              </div>
              <div className="text">
                <span>Click to upload image</span>
              </div>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </StyledWrapper>
          {/* Image Preview */}
          {imagePreview && (
            <div className="image-preview">
              <h4>Image Preview:</h4>
              <img
                src={imagePreview}
                alt="Category Preview"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <button type="submit" className="add-button">
          Add Category
        </button>
      </form>

      {message && (
        <p
          style={{
            color: message === "Category already exists." ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}

      <h2>EXISTING CATEGORIES</h2>
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="category-item">
            <div>
              {cat.image && (
                <img
                  src={`http://localhost:5555/uploads/${cat.image}`}
                  alt={cat.name}
                  style={{ width: "100px", height: "100px" }}
                />
              )}
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
            </div>
            <button
              onClick={() => handleDeleteCategory(cat._id)}
              className="delete-button"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

const StyledWrapper = styled.div`
  .custum-file-upload {
    height: 200px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    gap: 20px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cacaca;
    background-color: rgba(255, 255, 255, 1);
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0px 48px 35px -48px rgba(0, 0, 0, 0.1);
  }

  .custum-file-upload .icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .icon svg {
    height: 80px;
    fill: rgba(75, 85, 99, 1);
  }

  .custum-file-upload .text {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .custum-file-upload .text span {
    font-weight: 400;
    color: rgba(75, 85, 99, 1);
  }

  .custum-file-upload input {
    display: none;
  }

  .image-preview {
    margin-top: 10px;
    text-align: center;
  }

  .image-preview img {
    max-width: 200px;
    max-height: 200px;
    object-fit: contain;
    border-radius: 8px;
  }
`;

export default AddCategoryPage;
