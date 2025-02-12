// src/components/Layout.jsx
import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Topbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
