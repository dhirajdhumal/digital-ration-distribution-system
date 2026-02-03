import { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllocateStock.css";

function AllocationRecords() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, allocated, pending

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/village-admin/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const hasAllocations = user.allocatedStock && user.allocatedStock.length > 0;
    
    if (filterStatus === "allocated" && !hasAllocations) return false;
    if (filterStatus === "pending" && hasAllocations) return false;
    
    return matchesSearch;
  });

  // Calculate total quantity for a user
  const getTotalQuantity = (allocatedStock) => {
    if (!allocatedStock || allocatedStock.length === 0) return 0;
    return allocatedStock.reduce((sum, stock) => sum + (stock.quantity || 0), 0);
  };

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

  const allocatedCount = users.filter(u => u.allocatedStock && u.allocatedStock.length > 0).length;
  const pendingCount = users.length - allocatedCount;

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Allocation Records</h2>

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
              {users.length}
            </div>
            <div style={{ fontSize: "13px", color: "#666" }}>Total Users</div>
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
            placeholder="Search by name or email..."
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
            <option value="all">All Users</option>
            <option value="allocated">Allocated Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        {/* User Records */}
        {loading ? (
          <p>Loading records...</p>
        ) : filteredUsers.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            No users found matching your criteria.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filteredUsers.map((user) => {
              const hasAllocations = user.allocatedStock && user.allocatedStock.length > 0;
              const groupedAllocations = groupByDate(user.allocatedStock || []);

              return (
                <div
                  key={user._id}
                  style={{
                    border: hasAllocations ? "2px solid #4caf50" : "2px solid #ff9800",
                    borderRadius: "12px",
                    padding: "20px",
                    backgroundColor: hasAllocations ? "#f9fff9" : "#fff9f0",
                  }}
                >
                  {/* User Header */}
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
                        {hasAllocations ? "✓ " : "⏳ "}{user.name}
                      </h3>
                      <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                        {user.email}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: hasAllocations ? "#4caf50" : "#ff9800"
                      }}>
                        {user.allocatedStock?.length || 0}
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
                      No stock allocated to this user yet
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
