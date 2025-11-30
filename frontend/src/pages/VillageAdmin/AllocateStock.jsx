import React, { useState, useEffect, useMemo } from "react";
import api from "../../services/api";
import "./AllocateStock.css";

function AllocateStock() {
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);

  const [userId, setUserId] = useState("");
  const [stockId, setStockId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [availableQty, setAvailableQty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch users and stocks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, stocksRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/allocated-stocks/users")
        ]);
        setUsers(usersRes.data.users);
        setStocks(stocksRes.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Auto-hide messages
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const selectedStock = useMemo(
    () => stocks.find((s) => s._id === stockId),
    [stockId, stocks]
  );

  useEffect(() => {
    if (selectedStock) {
      setUnit(selectedStock.unit || "");
      setAvailableQty(selectedStock.quantity || 0);
    } else {
      setUnit("");
      setAvailableQty(null);
    }
  }, [selectedStock]);

  const resetForm = () => {
    setUserId("");
    setStockId("");
    setQuantity("");
  };

  const handleQuantityChange = (e) => {
    let val = Number(e.target.value);
    if (availableQty !== null && val > availableQty) val = availableQty;
    setQuantity(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const qtyNum = Number(quantity);
    if (!qtyNum || qtyNum <= 0) {
      setMessage("Please enter a valid quantity");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/admin/stocks/allocate/user", {
        userId,
        stockId,
        quantity: qtyNum,
        unit
      });

      setMessage(res.data.message || "Stock allocated successfully");

      setStocks(prevStocks =>
        prevStocks.map(s =>
          s._id === stockId ? { ...s, quantity: res.data.remainingStock } : s
        )
      );

      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error allocating stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Allocate Stock to User</h2>

        {message && (
          <div className={`alert ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Select User:
            <select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a User</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>
                  {u.name} 
                </option>
              ))}
            </select>
          </label>

          <label>
            Select Stock Item:
            <select
              value={stockId}
              onChange={(e) => setStockId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a Stock</option>
              {stocks.map(stock => (
                <option key={stock._id} value={stock._id}>
                  {stock.item} (Available: {stock.quantity} {stock.unit})
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity {availableQty ? `(Available: ${availableQty} ${unit})` : ""}
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={availableQty || undefined}
              disabled={loading || !stockId}
              required
            />
          </label>

          <label>
            Unit
            <input type="text" value={unit} disabled />
          </label>

          <button type="submit" disabled={loading || !userId || !stockId || !quantity}>
            {loading ? "Allocating..." : "Allocate Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AllocateStock;
