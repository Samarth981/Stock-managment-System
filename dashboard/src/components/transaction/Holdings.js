import React, { useState, useEffect, useContext } from "react";

import axiosInstance from "../../utils/axiosInstance";

import AuthContext from "../../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";

import { VerticalBarChart } from "../charts/VerticalBarChart";

const Holdings = () => {
  const { user, loading: authLoading } = useContext(AuthContext);

  const [allHoldings, setAllHoldings] = useState([]);

  const [loading, setLoading] = useState(true); // Track loading state

  const [error, setError] = useState(null);
  const [openError, setOpenError] = useState(false);

  const handleCloseError = () => setOpenError(false);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!user) return;

      setLoading(true);

      try {
        const response = await axiosInstance.get("/holdings");
        setAllHoldings(response.data);
      } catch (error) {
        setError("Failed to fetch holdings. Please try again later.");
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

  //chart
  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const profitLoss = curValue - stock.avg * stock.qty;
              const isProfit = profitLoss >= 0;
              const profitClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg?.toFixed(2)}</td>
                  <td>{stock.price?.toFixed(2)}</td>
                  <td>{curValue?.toFixed(2)}</td>
                  <td className={profitClass}>{profitLoss?.toFixed(2)}</td>
                  <td className={profitClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalBarChart data={data} />
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

export default Holdings;
