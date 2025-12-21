import React, { useState, useEffect, useContext } from "react";

import axiosInstance from "../../utils/axiosInstance";
import { Snackbar, Alert } from "@mui/material";

import AuthContext from "../../context/AuthContext";

const Positions = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [allPositions, setAllPositions] = useState([]);

  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => setOpenError(false);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const response = await axiosInstance.get("/positions");
        setAllPositions(response.data);
      } catch (error) {
        setError("Failed to fetch positions. Please try again later.");
        setOpenError(true);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (!authLoading && user) {
      fetchPositions(); // Only fetch if the user is logged in and the context is loaded
    }
  }, [user, authLoading]); // Trigger when user or authLoading changes

  if (authLoading || loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched or auth context is loading
  }

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const profitLoss = curValue - stock.avg * stock.qty;
              const isProfit = profitLoss >= 0;
              const profitClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg?.toFixed(2)}</td>
                  <td>{stock.price?.toFixed(2)}</td>
                  <td className={profitClass}>{profitLoss?.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
    </>
  );
};

export default Positions;
