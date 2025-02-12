import express from "express";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { startOfYear, endOfYear } from "date-fns";

const chartRoute = express.Router();

const getYearStartEnd = (year) => {
  const startDate = startOfYear(new Date(year, 0, 1));
  const endDate = endOfYear(new Date(year, 11, 31));
  return { startDate, endDate };
};

chartRoute.get("/sales-report", async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const { year = currentYear } = req.query;
    
    const parsedYear = Number(year);
    if (isNaN(parsedYear) || parsedYear < 2000 || parsedYear > currentYear) {
      return res.status(400).json({ 
        error: `Invalid year. Please provide a year between 2000 and ${currentYear}.`
      });
    }

    const { startDate, endDate } = getYearStartEnd(parsedYear);

    // Get Available Years
    const availableYears = await Order.aggregate([
      { $match: { status: "ORDER DELIVERD" } },
      { $group: { _id: { $year: "$createdAt" } } },
      { $sort: { _id: 1 } }
    ]);
    const validYears = availableYears.map(y => y._id);

    // Ensure selected year is valid
    const selectedYear = validYears.includes(parsedYear) ? parsedYear : Math.max(...validYears);
    const { startDate: validStartDate, endDate: validEndDate } = getYearStartEnd(selectedYear);

    // Monthly Sales Aggregation
    const salesByMonth = await Order.aggregate([
      { $match: { status: "ORDER DELIVERD", createdAt: { $gte: validStartDate, $lte: validEndDate } } },
      { $group: { _id: { $month: "$createdAt" }, totalSales: { $sum: "$totals.amount" }, totalOrders: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Most Sold Products by Month
    const mostSoldProductsByMonth = await Order.aggregate([
      { $match: { status: "ORDER DELIVERD", createdAt: { $gte: validStartDate, $lte: validEndDate } } },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, productId: "$cartItems.productId" },
          totalQuantity: { $sum: "$cartItems.quantity" },
        },
      },
      { $sort: { "_id.month": 1, totalQuantity: -1 } },
      {
        $group: {
          _id: "$_id.month",
          productId: { $first: "$_id.productId" },
          totalQuantity: { $first: "$totalQuantity" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Populate product details
    const detailedMostSoldProductsByMonth = await Product.populate(mostSoldProductsByMonth, {
      path: "productId",
      select: "productName productCategory",
    });

    res.json({
      salesByMonth,
      mostSoldProductsByMonth: detailedMostSoldProductsByMonth,
      availableYears: validYears,
      selectedYear
    });

  } catch (error) {
    console.error("Error in sales report:", error);
    res.status(500).json({ error: error.message });
  }
});

export default chartRoute;
