import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import styled from "styled-components";
import axios from "axios";
import "../cssf/Home.css";
import Footer from "../components/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Line } from "react-chartjs-2";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const position = [8.8932, 76.6141];

  const slides = [
    {
      url: "/images/jsw.jpg",
      title: "Slide 1",
    },
    {
      url: "/images/steel.jpg",
      title: "Slide 2",
    },
    {
      url: "/images/screws.jpg",
      title: "Slide 3",
    },
    {
      url: "/images/items.jpg",
      title: "Slide 2",
    },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:5555/categories")
      .then((response) => {
        setCategories(response.data);
        setFilteredCategories(response.data); // Initialize filtered categories
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/catproduct?category=${categoryName}`);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter categories based on search input
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  }; 
  return (
    <div className="main-container">
      <nav className="nav-container">
        <div className="logo">HOUSEHOLD HARDWARE</div>
      </nav>

      <div className="content-wrapper">
        <div className="hero-container">
          {/* Navigation Buttons */}
          <button className="slide-nav prev" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <button className="slide-nav next" onClick={nextSlide}>
            <ChevronRight />
          </button>

          {/* Slideshow */}
          <div className="slideshow-container">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${currentSlide === index ? "active" : ""}`}
              >
                <img
                  src={slide.url}
                  alt={slide.title}
                  onError={(e) => {
                    e.target.src = "/api/placeholder/1200/600";
                    e.target.alt = "Image failed to load";
                  }}
                />
                <div className="slide-overlay"></div>
              </div>
            ))}

            {/* Hero Content */}
            <div className="hero-content">
              {/* <h1>MORE THAN A</h1>
              <h1>DESIGN</h1>
              <p>
                Our agency is a dynamic fusion of innovation and expertise,
                committed to crafting novel experiences that leave an incredible
                impact.
              </p> */}
            </div>

            {/* Slide Indicators */}
            <div className="slide-indicators">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    currentSlide === index ? "active" : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>

          {/* Decorative Lines */}
        </div>

        {/* Services Grid */}
        
        <div className="services-container">
        <div className="homesearch-container">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="homesearch-input"
          />
        </div>

          {loading ? (
            <div className="loading">
              <StyleddWrapper>
                <div className="loader3">
                  <div className="circle1" />
                  <div className="circle1" />
                  <div className="circle1" />
                  <div className="circle1" />
                  <div className="circle1" />
                </div>
              </StyleddWrapper>
            </div>
          ) :filteredCategories.length > 0 ? (
            <div className="services-grid">
              {filteredCategories.map((category) => (
                <div
                  key={category._id}
                  className="service-card"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="card-image">
                    <img
                      src={`http://localhost:5555/uploads/${category.image}`}
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = "/api/placeholder/400/300";
                        e.target.alt = "Image failed to load";
                      }}
                    />
                  </div>
                  <h3>{category.name}</h3>
                  <button>View More →</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-results">No categories found.</p>
          )}
        </div>
      </div>
      <div className="bottom-section flex flex-col md:flex-row items-center justify-between py-10">
        {/* Left Side (Image) */}
        <div className="mr-6">
          <img
            src="/images/NHpic.jpeg"
            alt="Household Hardwares"
            className="w-[200px] h-[200px] rounded-xl object-cover"
          />
        </div>

        {/* Middle (Text Information) */}
        <div className="text-center md:text-left mb-4 md:mb-0 ">
          <div className="details">
            <p>
              <p>
                Nadakkadavunkal Hardwares Edappalayam P.O, Edappalayam <br />
                Kollam, Kerala <br />
                PIN: 691309 <br />
                Contact: 944755**** <br />
              </p>
            </p>
            <Link to="/contact-us" className="contact-link">
            Contact Us
          </Link>
          </div>

        
        </div>

        {/* Right Side (Map) */}
        <div className="w-[300px] h-[265px] rounded-xl overflow-hidden">
          <MapContainer
            center={position}
            zoom={15}
            style={{ width: "300px", height: "265px", borderRadius: "20px" }} // Ensuring visibility
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}>
              <Popup>Nadakkadavunkal Hardwares</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const StyleddWrapper = styled.div`
  .loader3 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle1 {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 10px;
    background-color: white;
    animation: circle1 1s ease-in-out infinite;
  }

  .circle1:nth-child(2) {
    animation-delay: 0.2s;
  }

  .circle1:nth-child(3) {
    animation-delay: 0.4s;
  }

  .circle1:nth-child(4) {
    animation-delay: 0.6s;
  }

  .circle1:nth-child(5) {
    animation-delay: 0.8s;
  }

  @keyframes circle1 {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    50% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

export default Home;
