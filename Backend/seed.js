// const mongoose = require("mongoose");
// require("dotenv").config();
// const { HoldingsModel } = require("./model/HoldingsModel");
// const { OrdersModel } = require("./model/OrdersModel");
// const { PositionsModel } = require("./model/PositionsModel");

// // Replace with your actual MongoDB connection string
// const MONGO_URI = process.env.MONGO_URL;

// const holdings = [
//   {
//     userId: "694783ff2e124a881f568629",
//     name: "IBM",
//     qty: 10,
//     avg: 300,
//     price: 305,
//     net: "+1.67%",
//     day: "+0.50%",
//   },
//   {
//     userId: "6947846f2e124a881f56862c",
//     name: "AAPL",
//     qty: 15,
//     avg: 180,
//     price: 185,
//     net: "+2.78%",
//     day: "+1.20%",
//   },
//   {
//     userId: "6947847c2e124a881f56862f",
//     name: "MSFT",
//     qty: 20,
//     avg: 400,
//     price: 395,
//     net: "-1.25%",
//     day: "-0.80%",
//   },
//   {
//     userId: "694784832e124a881f568632",
//     name: "GOOGL",
//     qty: 12,
//     avg: 120,
//     price: 125,
//     net: "+4.17%",
//     day: "+2.00%",
//   },
//   {
//     userId: "694784882e124a881f568635",
//     name: "TSLA",
//     qty: 8,
//     avg: 250,
//     price: 260,
//     net: "+4.00%",
//     day: "+1.50%",
//   },
// ];

// const orders = [
//   {
//     userId: "694783ff2e124a881f568629",
//     name: "IBM",
//     qty: 10,
//     price: 305,
//     mode: "BUY",
//     time: new Date("2025-12-20T10:00:00Z"),
//   },
//   {
//     userId: "6947846f2e124a881f56862c",
//     name: "AAPL",
//     qty: 15,
//     price: 185,
//     mode: "BUY",
//     time: new Date("2025-12-20T10:05:00Z"),
//   },
//   {
//     userId: "6947847c2e124a881f56862f",
//     name: "MSFT",
//     qty: 5,
//     price: 395,
//     mode: "SELL",
//     time: new Date("2025-12-20T10:10:00Z"),
//   },
//   {
//     userId: "694784832e124a881f568632",
//     name: "GOOGL",
//     qty: 12,
//     price: 125,
//     mode: "BUY",
//     time: new Date("2025-12-20T10:15:00Z"),
//   },
//   {
//     userId: "694784882e124a881f568635",
//     name: "TSLA",
//     qty: 8,
//     price: 260,
//     mode: "BUY",
//     time: new Date("2025-12-20T10:20:00Z"),
//   },
// ];

// const positions = [
//   {
//     userId: "694783ff2e124a881f568629",
//     product: "equity",
//     name: "IBM",
//     qty: 10,
//     avg: 300,
//     price: 305,
//     net: "+1.67%",
//     day: "+0.50%",
//     isLoss: false,
//   },
//   {
//     userId: "6947846f2e124a881f56862c",
//     product: "equity",
//     name: "AAPL",
//     qty: 15,
//     avg: 180,
//     price: 185,
//     net: "+2.78%",
//     day: "+1.20%",
//     isLoss: false,
//   },
//   {
//     userId: "6947847c2e124a881f56862f",
//     product: "equity",
//     name: "MSFT",
//     qty: 15,
//     avg: 400,
//     price: 395,
//     net: "-1.25%",
//     day: "-0.80%",
//     isLoss: true,
//   },
//   {
//     userId: "694784832e124a881f568632",
//     product: "equity",
//     name: "GOOGL",
//     qty: 12,
//     avg: 120,
//     price: 125,
//     net: "+4.17%",
//     day: "+2.00%",
//     isLoss: false,
//   },
//   {
//     userId: "694784882e124a881f568635",
//     product: "equity",
//     name: "TSLA",
//     qty: 8,
//     avg: 250,
//     price: 260,
//     net: "+4.00%",
//     day: "+1.50%",
//     isLoss: false,
//   },
// ];

// async function seedDatabase() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("Connected to MongoDB");

//     await HoldingsModel.insertMany(holdings);
//     await OrdersModel.insertMany(orders);
//     await PositionsModel.insertMany(positions);

//     console.log("Seed data inserted successfully");
//     mongoose.disconnect();
//   } catch (err) {
//     console.error("Error seeding database:", err);
//     mongoose.disconnect();
//   }
// }

// seedDatabase();
