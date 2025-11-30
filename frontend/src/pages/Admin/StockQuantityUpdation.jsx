import './StockQuantityUpdation.css';
import api from '../../services/api';
import AuthContext from '../../context/authContext';
import { useContext, useState, useEffect } from 'react';

function StockQuantityUpdation() {
  const { user } = useContext(AuthContext);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch stocks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/stocks");
        console.log("Stocks data:", res.data);
        
        // Safely handle response structure
        const stockList = Array.isArray(res.data)
          ? res.data
          : res.data.stocks || [];
        setStocks(stockList);
      } catch (err) {
        console.error("Error fetching stocks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update stock quantity
  const handleUpdateStock = async (stockId, newQuantity) => {
    if (newQuantity < 0) {
      alert("Quantity cannot be negative!");
      return;
    }

    setUpdatingId(stockId);
    try {
      const res = await api.put(`/admin/stocks/${stockId}`, {
        quantity: newQuantity,
      });

      // Update local list with new quantity
      const updatedStock = res.data.stock;
      setStocks((prevStocks) =>
        prevStocks.map((s) =>
          s._id === updatedStock._id ? updatedStock : s
        )
      );
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Failed to update stock.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="stock-container">
      <h1>Stock Quantity Updation</h1>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : stocks.length === 0 ? (
        <p className="no-stocks">No stock items found.</p>
      ) : (
        <ul className="stock-list">
          {stocks.map((stock) => (
            <li key={stock._id} className="stock-item">
              <span className="stock-name">
                {stock.item}: <strong>{stock.quantity}</strong>
              </span>

              <div className="stock-buttons">
                <button
                  className="increase-btn"
                  onClick={() =>
                    handleUpdateStock(stock._id, stock.quantity + 1)
                  }
                  disabled={updatingId === stock._id}
                >
                  {updatingId === stock._id ? "Updating..." : "Increase"}
                </button>

                <button
                  className="decrease-btn"
                  onClick={() =>
                    handleUpdateStock(stock._id, stock.quantity - 1)
                  }
                  disabled={updatingId === stock._id || stock.quantity <= 0}
                >
                  {updatingId === stock._id ? "Updating..." : "Decrease"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StockQuantityUpdation;
