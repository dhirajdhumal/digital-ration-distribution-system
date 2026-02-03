import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Dashboard.css";

function AllocatedRations() {
  const [allocatedStocks, setAllocatedStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocatedStocks = async () => {
      try {
        const res = await api.get("/user/allocated-stocks");
        setAllocatedStocks(res.data);
      } catch (err) {
        console.error("Error fetching allocated stocks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocatedStocks();
  }, []);

  // Group stocks by allocation date
  const groupByDate = (stocks) => {
    const grouped = {};
    
    stocks.forEach((stock) => {
      const date = new Date(stock.allocatedAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(stock);
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(grouped).sort((a, b) => {
      return new Date(b[1][0].allocatedAt) - new Date(a[1][0].allocatedAt);
    });
  };

  const groupedStocks = groupByDate(allocatedStocks);

  return (
    <div className="notifications-container">
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>
        Your Allocated Rations
      </h2>
      <div className="notification-list">
        {loading ? (
          <p>Loading allocated rations...</p>
        ) : allocatedStocks.length === 0 ? (
          <p>No rations allocated yet.</p>
        ) : (
          groupedStocks.map(([date, stocks], groupIndex) => (
            <div
              key={groupIndex}
              style={{
                border: "2px solid #4caf50",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "25px",
                backgroundColor: "#f9fff9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {/* Date Header */}
              <div
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0, fontSize: "18px" }}>
                  📅 Allocated on: {date}
                </h3>
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.3)",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {stocks.length} item{stocks.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Stock Items Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "15px",
                }}
              >
                {stocks.map((stock, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      backgroundColor: "white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0 0 12px 0",
                        color: "#2c3e50",
                        fontSize: "16px",
                        borderBottom: "2px solid #4caf50",
                        paddingBottom: "8px",
                      }}
                    >
                      {stock.stockId?.item || "Unknown Item"}
                    </h4>
                    
                    <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
                      <p style={{ margin: "5px 0" }}>
                        <strong>Quantity:</strong>{" "}
                        <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                          {stock.quantity} {stock.unit}
                        </span>
                      </p>
                      
                      <p style={{ margin: "5px 0" }}>
                        <strong>Price:</strong> ₹{stock.stockId?.price || "N/A"}
                      </p>
                      
                      {stock.stockId?.expiryDate && (
                        <p style={{ margin: "5px 0" }}>
                          <strong>Expiry:</strong>{" "}
                          <span
                            style={{
                              color: stock.stockId.isExpired
                                ? "red"
                                : stock.stockId.isExpiringSoon
                                ? "orange"
                                : "green",
                              fontWeight: "bold",
                            }}
                          >
                            {new Date(stock.stockId.expiryDate).toLocaleDateString()}
                            {stock.stockId.isExpired && " ⚠️"}
                            {stock.stockId.isExpiringSoon && !stock.stockId.isExpired && " ⏰"}
                          </span>
                        </p>
                      )}
                      
                      {stock.stockId?.batchNumber && (
                        <p style={{ margin: "5px 0" }}>
                          <strong>Batch:</strong> {stock.stockId.batchNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllocatedRations;
