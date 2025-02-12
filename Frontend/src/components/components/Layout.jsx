import React from "react";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
  return (
    <div>
      {children}  {/* This renders the page content */}
      <Footer />  {/* Footer always appears at the bottom */}
    </div>
  );
};

export default Layout;
