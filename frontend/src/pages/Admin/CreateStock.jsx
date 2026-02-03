import React, { useState } from "react";
import api from "../../services/api";
import "./AllocateStock.css";

function CreateStock() {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const stockData = {
        item,
        quantity: Number(quantity),
        unit,
        price: Number(price),
      };

      if (expiryDate) stockData.expiryDate = expiryDate;
      if (batchNumber) stockData.batchNumber = batchNumber;

      const res = await api.post("/admin/stocks", stockData);

      setMessage(res.data.message || "Stock created successfully");
      setItem("");
      setQuantity("");
      setUnit("");
      setPrice("");
      setExpiryDate("");
      setBatchNumber("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Create New Stock Item</h2>

        {message && (
          <div
            className={`alert ${
              message.toLowerCase().includes("success") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Item Name:
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="e.g., Rice, Wheat, Sugar"
              disabled={loading}
              required
            />
          </label>

          <label>
            Quantity:
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              placeholder="e.g., 1000"
              disabled={loading}
              required
            />
          </label>

          <label>
            Unit:
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g., kg, liters, units"
              disabled={loading}
              required
            />
          </label>

          <label>
            Price (₹):
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={0}
              step="0.01"
              placeholder="e.g., 50.00"
              disabled={loading}
              required
            />
          </label>

          <label>
            Expiry Date (Optional):
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              disabled={loading}
            />
          </label>

          <label>
            Batch Number (Optional):
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder="e.g., BATCH-2024-001"
              disabled={loading}
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Stock"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateStock;
