import React, { useState, useEffect, useContext } from "react";

import axiosInstance from "../../utils/axiosInstance";
import { Snackbar, Alert } from "@mui/material";

import AuthContext from "../../context/AuthContext";

const Orders = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [allOrder, setAllOrder] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => setOpenError(false);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const response = await axiosInstance.get("/orders");
        setAllOrder(response.data);
      } catch (error) {
        setError("Failed to fetch orders. Please try again later.");
        setOpenError(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchPositions();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h3 className="title">Order ({allOrder.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty.</th>
              <th>price</th>
              <th>mode</th>
              <th className="OrderTimeTH">Time</th>
            </tr>
          </thead>
          <tbody>
            {allOrder.map((stock, index) => {
              const orderClass = stock.mode === "BUY" ? "profit" : "loss";
              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.price ? stock.price.toFixed(2) : "0.00"}</td>
                  <td className={orderClass}>{stock.mode}</td>
                  <td className="OrderTime">
                    {stock.time ? new Date(stock.time).toLocaleString() : "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Snackbar
          open={openError}
          autoHideDuration={4000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Orders;
