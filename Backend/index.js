require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const errorHandler = require("./Middlewares/errorHandler");
const { refreshToken } = require("./Controllers/TokenController");

const holdingsRoutes = require("./routes/holdingsRoutes");
const positionsRoutes = require("./routes/positionsRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const shellRoutes = require("./routes/shellRoutes");
const AllOrderRoutes = require("./routes/AllOrderRoutes");
const authRoute = require("./routes/AuthRoute");
const marketRoutes = require("./routes/market.js");

const PORT = process.env.PORT;
const uri = process.env.MONGO_URL;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Running");
});
// Public Routes
app.use("/auth", authRoute);

// Protected Route
app.use("/holdings", holdingsRoutes);
app.use("/positions", positionsRoutes);
app.use("/Neworder", ordersRoutes);
app.use("/sell", shellRoutes);
app.use("/orders", AllOrderRoutes);
app.use("/api/market", marketRoutes);
app.post("/refresh-token", refreshToken);

// Custom 404 Error Handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

mongoose
  .connect(uri)
  .then(async () => {
    app.listen(PORT, () => console.log(`App started`));
  })
  .catch((err) => {
    setTimeout(() => process.exit(1), 5000);
  });
