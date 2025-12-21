const express = require("express");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");
const {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
} = require("../utils/ExpressError");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");

router.post(
  "/",
  AuthMiddleware,
  WrapAsync(async (req, res, next) => {
    const userId = req.user.id;

    if (!userId) {
      throw new AuthenticationError("User is unauthorized");
    }

    if (req.body.userId && req.body.userId !== userId) {
      throw new AuthorizationError(
        "You do not have permission to perform this action"
      );
    }

    const actualUserId = req.body.userId || userId;

    if (!req.body.qty || !req.body.price) {
      throw new ValidationError("Missing required fields: qty and price");
    }

    let existingHolding = await HoldingsModel.findOne({
      name: req.body.name,
      userId: actualUserId,
    });

    if (!existingHolding) {
      throw new ValidationError("No existing stock to sell!");
    }

    if (existingHolding.qty < req.body.qty) {
      throw new ValidationError("Not enough stock to sell!");
    }

    existingHolding.qty -= req.body.qty;

    // Recalculate net change and day change
    let netChange =
      ((req.body.price - existingHolding.avg) / existingHolding.avg) * 100;
    let dayChange =
      ((req.body.price - existingHolding.price) / existingHolding.price) * 100;

    existingHolding.price = req.body.price;
    existingHolding.net = `${netChange > 0 ? "+" : ""}${netChange.toFixed(2)}%`;
    existingHolding.day = `${dayChange > 0 ? "+" : ""}${dayChange.toFixed(2)}%`;

    if (existingHolding.qty === 0) {
      await HoldingsModel.deleteOne({ _id: existingHolding._id });
    } else {
      await existingHolding.save();
    }

    let sellOrder = new OrdersModel({
      userId: actualUserId,
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: "SELL",
      time: req.body.time || new Date(),
    });
    await sellOrder.save();

    res.json({ message: "Sell order saved and holdings updated!" });
  })
);

module.exports = router;
