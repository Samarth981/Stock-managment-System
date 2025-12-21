import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

import GeneralContext from "../../context/GeneralContext";
import AuthContext from "../../context/AuthContext";

import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(1);
  const [error, setError] = useState("");
  const generalContext = useContext(GeneralContext);
  const { user } = useContext(AuthContext);

  const validateInput = () => {
    if (stockQuantity < 1) {
      setError("Quantity must be greater than zero.");
      return false;
    } else if (stockPrice < 1) {
      setError("Price must be greater than zero.");
      return false;
    }

    setError("");
    return true;
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  //after add qty and price error remove & chnage value according to set
  const handelErrorRemove = (setter) => (e) => {
    const value = e.target.value; //which value is triger
    setter(value);

    // Clear errors only if the entered value is valid
    if (
      (setter === setStockQuantity && value >= 1) ||
      (setter === setStockPrice && value >= 1)
    ) {
      setError("");
    }
  };

  const handleBuyClick = () => {
    if (!user) {
      setError("Please log in to sell stocks.");
      return;
    }
    if (!validateInput()) return;

    try {
      axiosInstance.post("/Neworder", {
        userId: user.id, // Include userId from AuthContext
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
        time: new Date().toISOString(),
      });
      generalContext.closeBuyWindow();
    } catch (error) {
      setError(error.response?.data?.error || "Failed to place buy order.");
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      {error && (
        <div className="error-message" style={{ color: "red", margin: "2px" }}>
          {error}
        </div>
      )}
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              onChange={handelErrorRemove(setStockQuantity)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="1"
              onChange={handelErrorRemove(setStockPrice)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuyClick}>
            Buy
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
