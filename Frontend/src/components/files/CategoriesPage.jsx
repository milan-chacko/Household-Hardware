import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../cssf/CategoriesPage.css";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleCategoryClick = (categoryName) => {
    navigate(`/product?category=${categoryName}`);
  };

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      <div className="categories-container">
        {categories.map((category) => (
          <div
            key={category._id}
            className="category-card"
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.image && (
              <img
                src={`http://localhost:5555/uploads/${category.image}`}
                alt={category.name}
                className="category-image"
              />
            )}
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
