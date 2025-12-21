require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_KEY;
const DEFAULT_EXCHANGE = (process.env.DEFAULT_EXCHANGE || "BSE").toUpperCase();
const symbolMap = require("./symbolMap");

const { ValidationError } = require("../utils/ExpressError");

const symbols = [
  "INFY",
  "ONGC",
  "TCS",
  "KPITTECH",
  "QUICKHEAL",
  "WIPRO",
  "RELIANCE",
  "HUL",
];

//manual data
let cache = [
  {
    name: "INFY",
    price: 1650.25,
    percent: "0.45%",
    isDown: false,
  },
  {
    name: "ONGC",
    price: 210.1,
    percent: "-0.25%",
    isDown: true,
  },
  {
    name: "TCS",
    price: 3450.75,
    percent: "1.10%",
    isDown: false,
  },
  {
    name: "KPITTECH",
    price: 890.4,
    percent: "0.00%",
    isDown: false,
  },
  {
    name: "QUICKHEAL",
    price: 150.0,
    percent: "0.30%",
    isDown: false,
  },
  {
    name: "WIPRO",
    price: 420.5,
    percent: "-0.15%",
    isDown: true,
  },
  {
    name: "RELIANCE",
    price: 2450.0,
    percent: "0.75%",
    isDown: false,
  },
  {
    name: "HUL",
    price: 2600.3,
    percent: "-0.05%",
    isDown: true,
  },
];

let updateIndex = 0;

const toApiSymbol = (symbol) => {
  const mapped = symbolMap[symbol.toUpperCase()] || symbol;
  if (/.(BSE|NSE)$/i.test(mapped)) return mapped;
  return `${mapped}.${DEFAULT_EXCHANGE}`;
};

router.get("/watchlist", async (req, res) => {
  const symbolToUpdate = symbols[updateIndex % symbols.length];

  try {
    const response = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: toApiSymbol(symbolToUpdate),
        apikey: API_KEY,
      },
      timeout: 15000,
    });

    const data = response.data["Global Quote"];
    if (data) {
      const price = parseFloat(data["05. price"]);
      const change = parseFloat(data["09. change"]);
      const changePercent = data["10. change percent"];

      cache = cache.map((item) =>
        item.name === symbolToUpdate
          ? {
              ...item,
              price: Number.isFinite(price) ? price : item.price,
              percent: changePercent || item.percent,
              isDown: Number.isFinite(change) ? change < 0 : item.isDown,
            }
          : item
      );
    }
  } catch (err) {
    ValidationError(`Error fetching ${symbolToUpdate}`);
  }
  updateIndex++;
  res.json(cache);
});
module.exports = router;
