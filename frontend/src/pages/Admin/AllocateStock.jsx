import { useState, useEffect } from "react";
import api from "../../services/api";
import "./AllocateStock.css";

function AllocateStock() {
  const [villageAdmins, setVillageAdmins] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [villageAdminId, setVillageAdminId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Array to hold multiple stock allocations
  const [allocations, setAllocations] = useState([
    { stockId: "", quantity: "", unit: "", availableQty: 0 }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminRes, stockRes] = await Promise.all([
          api.get("/admin/village-admins"),
          api.get("/admin/stocks")
        ]);
        setVillageAdmins(adminRes.data);
        setStocks(stockRes.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const addAllocationRow = () => {
    setAllocations([
      ...allocations,
      { stockId: "", quantity: "", unit: "", availableQty: 0 }
    ]);
  };

  const removeAllocationRow = (index) => {
    if (allocations.length > 1) {
      setAllocations(allocations.filter((_, i) => i !== index));
    }
  };

  const handleStockChange = (index, stockId) => {
    const selectedStock = stocks.find((s) => s._id === stockId);
    const newAllocations = [...allocations];
    newAllocations[index] = {
      stockId,
      quantity: "",
      unit: selectedStock?.unit || "",
      availableQty: selectedStock?.quantity || 0
    };
    setAllocations(newAllocations);
  };

  const handleQuantityChange = (index, value) => {
    const newAllocations = [...allocations];
    let val = Number(value);
    const maxQty = newAllocations[index].availableQty;
    if (maxQty && val > maxQty) val = maxQty;
    newAllocations[index].quantity = val;
    setAllocations(newAllocations);
  };

  const resetForm = () => {
    setVillageAdminId("");
    setAllocations([{ stockId: "", quantity: "", unit: "", availableQty: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate allocations
    const validAllocations = allocations.filter(
      (a) => a.stockId && a.quantity && Number(a.quantity) > 0
    );

    if (validAllocations.length === 0) {
      setMessage("Please add at least one stock item with quantity");
      setLoading(false);
      return;
    }

    try {
      // Send bulk allocation request
      const res = await api.post("/admin/stocks/allocate-bulk", {
        villageAdminId,
        allocations: validAllocations.map(a => ({
          stockId: a.stockId,
          quantity: Number(a.quantity),
          unit: a.unit
        }))
      });

      setMessage(res.data.message || "Stock allocated successfully");

      // Update local stocks state
      if (res.data.updatedStocks) {
        setStocks(prevStocks =>
          prevStocks.map(s => {
            const updated = res.data.updatedStocks.find(
              u => u.stockId === s._id
            );
            return updated ? { ...s, quantity: updated.remainingQuantity } : s;
          })
        );
      }

      // Refresh village admins list
      const adminRes = await api.get("/admin/village-admins");
      setVillageAdmins(adminRes.data);

      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error allocating stock");
    } finally {
      setLoading(false);
    }
  };

  // Separate village admins into allocated and not allocated
  const allocatedAdmins = villageAdmins.filter(va => va.allocatedStock && va.allocatedStock.length > 0);
  const notAllocatedAdmins = villageAdmins.filter(va => !va.allocatedStock || va.allocatedStock.length === 0);

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Allocate Stock to Village Admin</h2>

        {message && (
          <div className={`alert ${message.toLowerCase().includes("success") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Allocation Status Summary */}
        {villageAdmins.length > 0 && (
          <div style={{
            backgroundColor: "#e3f2fd",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px"
          }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2196f3" }}>
                {villageAdmins.length}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Total Village Admins</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#4caf50" }}>
                ✓ {allocatedAdmins.length}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Allocated</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9800" }}>
                {notAllocatedAdmins.length}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>Pending</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Select Village Admin:
            <select
              value={villageAdminId}
              onChange={(e) => setVillageAdminId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a Village Admin</option>
              {villageAdmins.map(admin => (
                <option key={admin._id} value={admin._id}>
                  {admin.allocatedStock && admin.allocatedStock.length > 0 ? "✓ " : ""}{admin.name || admin.email}
                  {admin.allocatedStock && admin.allocatedStock.length > 0 ? ` (${admin.allocatedStock.length} items)` : ""}
                </option>
              ))}
            </select>
          </label>

          <div style={{ marginTop: "20px", marginBottom: "10px" }}>
            <h3 style={{ marginBottom: "15px" }}>Stock Items to Allocate:</h3>
            
            {allocations.map((allocation, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#f9f9f9",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <strong>Item #{index + 1}</strong>
                  {allocations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAllocationRow(index)}
                      style={{
                        padding: "4px 12px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <label>
                  Select Stock Item:
                  <select
                    value={allocation.stockId}
                    onChange={(e) => handleStockChange(index, e.target.value)}
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

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }}>
                  <label>
                    Quantity {allocation.availableQty ? `(Max: ${allocation.availableQty})` : ""}
                    <input
                      type="number"
                      value={allocation.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      min={1}
                      max={allocation.availableQty || undefined}
                      disabled={loading || !allocation.stockId}
                      required
                    />
                  </label>

                  <label>
                    Unit
                    <input type="text" value={allocation.unit} disabled />
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAllocationRow}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginBottom: "20px",
                width: "100%"
              }}
              disabled={loading}
            >
              + Add Another Stock Item
            </button>
          </div>

          <button type="submit" disabled={loading || !villageAdminId}>
            {loading ? "Allocating..." : "Allocate All Stock Items"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AllocateStock;
