import React, { useEffect, useState } from "react";
import axios from "axios";
import "../cssf/SalesChart.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Footer from "../components/Footer";
import BackButton from "../BackButton";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [mostSoldProductsByMonth, setMostSoldProductsByMonth] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSalesData(new Date().getFullYear());
  }, []);

  const fetchSalesData = (year) => {
    setError(null);
    axios
      .get(`http://localhost:5555/sales/sales-report?year=${year}`)
      .then((res) => {
        console.log("✅ API Response:", res.data);
        setSalesData(res.data.salesByMonth);
        setMostSoldProductsByMonth(res.data.mostSoldProductsByMonth);
        setAvailableYears(res.data.availableYears);
        setSelectedYear(res.data.selectedYear);
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        setError(err.response?.data?.error || "An error occurred");
      });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Prepare data for the chart
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Total Sales (₹)",
        data: months.map((_, index) => {
          const monthData = salesData.find((s) => s._id === index + 1);
          return monthData ? monthData.totalSales : 0;
        }),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div style={{ padding: "0px 0px 10px 0rem" }}>
        {" "}
        <BackButton />
      </div>
      <div className="chart-container">
        <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
          {error && <div style={{ color: "red" }}>{error}</div>}

          {/* Year Selection Dropdown */}
          <select
            value={selectedYear || ""}
            onChange={(e) => fetchSalesData(Number(e.target.value))}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* 📊 Monthly Sales Chart */}
          <h3>Monthly Sales Revenue</h3>
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              height: "400px",
              margin: "auto",
            }}
          >
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
              }}
            />
          </div>

          {/* 📋 Most Sold Products Table */}
          <h3>Most Sold Products by Month</h3>
          {mostSoldProductsByMonth.length === 0 ? (
            <p>No data available for this year.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Month
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Product Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Category
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Units Sold
                  </th>
                </tr>
              </thead>
              <tbody>
                {mostSoldProductsByMonth.map((item) => (
                  <tr key={item._id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {months[item._id - 1]}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.productId?.productName || "Unknown"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.productId?.productCategory || "N/A"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.totalQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default SalesChart;
