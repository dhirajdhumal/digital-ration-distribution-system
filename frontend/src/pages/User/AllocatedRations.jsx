import { useState, useEffect } from "react";
import api from "../../services/api";
import "./UserPages.css";

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

    return Object.entries(grouped).sort((a, b) => {
      return new Date(b[1][0].allocatedAt) - new Date(a[1][0].allocatedAt);
    });
  };

  const groupedStocks = groupByDate(allocatedStocks);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📦 Your Allocated Rations</h1>
        <p className="page-subtitle">View your allocated ration items and quantities</p>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading your allocated rations...</p>
        </div>
      ) : allocatedStocks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3 className="empty-state-title">No Rations Allocated Yet</h3>
          <p className="empty-state-text">
            You haven't been allocated any rations yet. Please check back later or contact your village admin.
          </p>
        </div>
      ) : (
        <div className="items-list">
          {groupedStocks.map(([date, stocks], groupIndex) => (
            <div key={groupIndex} className="date-group">
              <div className="date-header">
                <h3 className="date-title">
                  <span>📅</span>
                  <span>Allocated on: {date}</span>
                </h3>
                <span className="date-count">
                  {stocks.length} item{stocks.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="items-grid">
                {stocks.map((stock, index) => (
                  <div key={index} className="grid-item">
                    <h4 className="grid-item-title">
                      {stock.stockId?.item || "Unknown Item"}
                    </h4>
                    
                    <div className="grid-item-details">
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value highlight">
                          {stock.quantity} {stock.unit}
                        </span>
                      </div>
                      
                      <div className="detail-row">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">
                          ₹{stock.stockId?.price || "N/A"}
                        </span>
                      </div>
                      
                      {stock.stockId?.expiryDate && (
                        <div className="detail-row">
                          <span className="detail-label">Expiry:</span>
                          <span 
                            className="detail-value"
                            style={{
                              color: stock.stockId.isExpired
                                ? "var(--error)"
                                : stock.stockId.isExpiringSoon
                                ? "var(--warning)"
                                : "var(--success)",
                            }}
                          >
                            {new Date(stock.stockId.expiryDate).toLocaleDateString()}
                            {stock.stockId.isExpired && " ⚠️"}
                            {stock.stockId.isExpiringSoon && !stock.stockId.isExpired && " ⏰"}
                          </span>
                        </div>
                      )}
                      
                      {stock.stockId?.batchNumber && (
                        <div className="detail-row">
                          <span className="detail-label">Batch:</span>
                          <span className="detail-value">
                            {stock.stockId.batchNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllocatedRations;
