import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./AllocatedStock.css";

function AllocatedStock() {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const res = await api.get("/admin/allocated-stocks");
        
        // Group allocations by village admin
        const grouped = res.data.reduce((acc, item) => {
          const key = item.villageAdminId;
          if (!acc[key]) acc[key] = { name: item.villageAdminName, stocks: [] };
          acc[key].stocks.push(item);
          return acc;
        }, {});
        
        setAllocations(Object.values(grouped));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllocations();
  }, []);

  if (loading) return <p>Loading allocations...</p>;

  return (
    <div className="allocated-stock-container">
      <h2>Allocated Stocks</h2>
      {allocations.length === 0 ? (
        <p>No allocations yet.</p>
      ) : (
        <div className="allocation-cards">
          {allocations.map((admin, idx) => (
            <div className="admin-card" key={idx}>
              <h3>{admin.name}</h3>
              <ul>
                {admin.stocks.map((stock, sIdx) => (
                  <li key={sIdx}>
                    {stock.stockItem}: {stock.quantity} {stock.unit} (Allocated at: {new Date(stock.allocatedAt).toLocaleString()})
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllocatedStock;
