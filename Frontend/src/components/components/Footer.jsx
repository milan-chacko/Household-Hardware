import React from "react";
import "../cssf/Footer.css"; // Create a CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <p className="p">&copy; {new Date().getFullYear()} Nadakkadavunkal Hardwares. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
