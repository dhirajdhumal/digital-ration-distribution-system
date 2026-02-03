import { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllocateStock.css";

function AllocationRecords() {
  const [villageAdmins, setVillageAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, allocated, pending

  useEffect(() => {
    const fetchVillageAdmins = async () => {
      try {
        const res = await api.get("/admin/village-admins");
        setVillageAdmins(res.data);
      } catch (err) {
        console.error("Error fetching village admins", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVillageAdmins();
  }, []);

  // Filter village admins based on search and status
  const filteredAdmins = villageAdmins.filter(admin => {
    const matchesSearch = admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.village?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasAllocations = admin.allocatedStock && admin.allocatedStock.length > 0;
    
    if (filterStatus === "allocated" && !hasAllocations) return false;
    if (filterStatus === "pending" && hasAllocations) return false;
    
    return matchesSearch;
  });

  // Group allocations by date
  const groupByDate = (allocatedStock) => {
    if (!allocatedStock || allocatedStock.length === 0) return [];
    
    const grouped = {};
    allocatedStock.forEach(stock => {
      const date = new Date(stock.allocatedAt).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(stock);
    });

    return Object.entries(grouped).sort((a, b) => 
      new Date(b[1][0].allocatedAt) - new Date(a[1][0].allocatedAt)
    );
  };

  const allocatedCount = villageAdmins.filter(va => va.allocatedStock && va.allocatedStock.length > 0).length;
  const pendingCount = villageAdmins.length - allocatedCount;

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Stock Distribution Records</h2>

        {/* Summary Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "15px",
          marginBottom: "25px",
          padding: "15px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2196f3" }}>
              {villageAdmins.length}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>Total Village Admins</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#4caf50" }}>
              {allocatedCount}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>Allocated</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#ff9800" }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>Pending</div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "15px",
          marginBottom: "25px"
        }}>
          <input
            type="text"
            placeholder="Search by name, email, or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px"
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="all">All Admins</option>
            <option value="allocated">Allocated Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        {/* Village Admin Records */}
        {loading ? (
          <p>Loading records...</p>
        ) : filteredAdmins.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            No village admins found matching your criteria.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredAdmins.map((admin) => {
              const hasAllocations = admin.allocatedStock && admin.allocatedStock.length > 0;
              const groupedAllocations = groupByDate(admin.allocatedStock || []);

              return (
                <div
                  key={admin._id}
                  style={{
                    border: hasAllocations ? "2px solid #4caf50" : "2px solid #ff9800",
                    borderRadius: "12px",
                    padding: "20px",
                    backgroundColor: hasAllocations ? "#f9fff9" : "#fff9f0",
                  }}
                >
                  {/* Admin Header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                    paddingBottom: "15px",
                    borderBottom: "2px solid #ddd"
                  }}>
                    <div>
                      <h3 style={{ margin: "0 0 5px 0", fontSize: "20px", color: "#2c3e50" }}>
                        {hasAllocations ? "✓ " : "⏳ "}{admin.name || admin.email}
                      </h3>
                      <p style={{ margin: "3px 0", color: "#666", fontSize: "14px" }}>
                        📧 {admin.email}
                      </p>
                      {admin.village && (
                        <p style={{ margin: "3px 0", color: "#666", fontSize: "14px" }}>
                          📍 {admin.village}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: hasAllocations ? "#4caf50" : "#ff9800"
                      }}>
                        {admin.allocatedStock?.length || 0}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {hasAllocations ? "Items Allocated" : "No Allocation"}
                      </div>
                    </div>
                  </div>

                  {/* Allocation Details */}
                  {hasAllocations ? (
                    <div>
                      {groupedAllocations.map(([date, stocks], index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "15px",
                            padding: "15px",
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0"
                          }}
                        >
                          <div style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: "#2196f3",
                            marginBottom: "10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                          }}>
                            📅 {date}
                            <span style={{
                              fontSize: "12px",
                              backgroundColor: "#e3f2fd",
                              padding: "2px 8px",
                              borderRadius: "12px",
                              fontWeight: "normal"
                            }}>
                              {stocks.length} item{stocks.length > 1 ? "s" : ""}
                            </span>
                          </div>

                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                            gap: "10px"
                          }}>
                            {stocks.map((stock, idx) => (
                              <div
                                key={idx}
                                style={{
                                  padding: "10px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "6px",
                                  borderLeft: "3px solid #4caf50"
                                }}
                              >
                                <div style={{ fontWeight: "bold", marginBottom: "5px", color: "#2c3e50" }}>
                                  {stock.stockId?.item || "Unknown Item"}
                                </div>
                                <div style={{ fontSize: "13px", color: "#666" }}>
                                  <strong style={{ color: "#4caf50" }}>
                                    {stock.quantity} {stock.unit}
                                  </strong>
                                </div>
                                {stock.stockId?.price && (
                                  <div style={{ fontSize: "12px", color: "#666", marginTop: "3px" }}>
                                    ₹{stock.stockId.price}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#ff9800",
                      fontStyle: "italic"
                    }}>
                      No stock allocated to this village admin yet
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllocationRecords;
