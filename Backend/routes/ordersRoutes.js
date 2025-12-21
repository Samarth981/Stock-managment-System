const express = require("express");
const { OrdersModel } = require("../model/OrdersModel");
const { HoldingsModel } = require("../model/HoldingsModel");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const router = express.Router();
const WrapAsync = require("../utils/WrapAsync");
const {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} = require("../utils/ExpressError");

router.post(
  "/",
  AuthMiddleware,
  WrapAsync(async (req, res, next) => {
    const userId = req.user.id;

    if (!userId) {
      throw new AuthenticationError("User is unauthorized");
    }

    const qty = Number(req.body.qty);
    const price = Number(req.body.price);
    let orderTime = new Date(req.body.time);

    if (isNaN(qty) || isNaN(price) || qty < 1 || price < 0.1) {
      throw new ValidationError("Invalid quantity or price");
    }

    if (req.body.userId && req.body.userId !== userId) {
      throw new AuthorizationError(
        "You do not have permission to perform this action"
      );
    }

    const actualUserId = req.body.userId || userId;

    let existingHolding = await HoldingsModel.findOne({
      name: req.body.name,
      userId: actualUserId,
    });

    if (existingHolding) {
      let totalQty = existingHolding.qty + qty;
      let totalCost = existingHolding.qty * existingHolding.avg + qty * price;
      let newAvgCost = totalCost / totalQty;

      let netChange =
        newAvgCost > 0
          ? (((price - newAvgCost) / newAvgCost) * 100).toFixed(2)
          : "0.00";
      let dayChange =
        existingHolding.price > 0
          ? (
              ((price - existingHolding.price) / existingHolding.price) *
              100
            ).toFixed(2)
          : "0.00";

      existingHolding.qty = totalQty;
      existingHolding.avg = newAvgCost;
      existingHolding.price = price;
      existingHolding.net =
        netChange == 0 ? "0.00%" : `${netChange > 0 ? "+" : ""}${netChange}%`;
      existingHolding.day =
        dayChange == 0 ? "0.00%" : `${dayChange > 0 ? "+" : ""}${dayChange}%`;

      await existingHolding.save();
    } else {
      let newHolding = new HoldingsModel({
        userId: actualUserId,
        name: req.body.name,
        qty,
        avg: price,
        price,
        net: "+0.00%",
        day: "+0.00%",
      });

      await newHolding.save();
    }
    let newOrder = new OrdersModel({
      userId: actualUserId,
      name: req.body.name,
      qty,
      price,
      mode: req.body.mode,
      time: isNaN(orderTime) ? new Date() : orderTime,
    });

    await newOrder.save();

    res.json({ message: "Order saved successfully" });
  })
);

module.exports = router;
