import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./MakeVillageAdmin.css";

function MakeVillageAdmin() {
  const { user } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState([]); // All users (both user and villageAdmin)
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const roles = [
    { name: "user", label: "User" },
    { name: "villageAdmin", label: "Village Admin" }
  ];

  const fetchAllUsers = async () => {
    try {
      // Fetch both regular users and village admins
      const [usersRes, villageAdminsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/village-admins")
      ]);
      
      // Combine both arrays
      const combined = [...usersRes.data.users, ...villageAdminsRes.data];
      setAllUsers(combined);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch users from database");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const resetForm = () => {
    setSelectedUserId("");
    setSelectedRole("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUserId || !selectedRole) {
      setMessage("❌ Please select both user and role");
      return;
    }

    // Find the selected user to show their current role
    const selectedUser = allUsers.find(u => u._id === selectedUserId);
    const currentRole = selectedUser?.role || "user";

    if (currentRole === selectedRole) {
      setMessage("❌ User already has this role");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/admin/make-village-admin", { 
        userId: selectedUserId, 
        role: selectedRole 
      });
      
      const action = selectedRole === "villageAdmin" ? "promoted to" : "changed to";
      setMessage(`✅ User ${action} ${selectedRole === "villageAdmin" ? "Village Admin" : "User"} successfully!`);
      
      resetForm();
      fetchAllUsers(); // Refresh the list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to change role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Manage User Roles</h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Promote users to Village Admin or demote Village Admins to regular users
        </p>

        {message && (
          <p
            className={`message ${
              message.includes("successfully") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Select User:
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a User</option>
              {allUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.village}) - Current: {u.role === "villageAdmin" ? "Village Admin" : "User"}
                </option>
              ))}
            </select>
          </label>

          <label>
            Change Role To:
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a Role</option>
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Changing Role..." : "Change Role"}
          </button>
        </form>
      </div>

      {/* Display Current Users by Role */}
      <div className="card" style={{ marginTop: "30px" }}>
        <h2>Current Users</h2>
        
        <div style={{ marginBottom: "30px" }}>
          <h3 style={{ color: "#1976d2", marginBottom: "15px" }}>Village Admins</h3>
          {allUsers.filter(u => u.role === "villageAdmin").length === 0 ? (
            <p>No village admins yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#e3f2fd" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #2196f3" }}>Village</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.filter(u => u.role === "villageAdmin").map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>{u.name}</td>
                      <td style={{ padding: "12px" }}>{u.email}</td>
                      <td style={{ padding: "12px" }}>{u.village}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h3 style={{ color: "#4caf50", marginBottom: "15px" }}>Regular Users</h3>
          {allUsers.filter(u => u.role === "user").length === 0 ? (
            <p>No regular users.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#e8f5e9" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #4caf50" }}>Name</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #4caf50" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #4caf50" }}>Village</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.filter(u => u.role === "user").map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>{u.name}</td>
                      <td style={{ padding: "12px" }}>{u.email}</td>
                      <td style={{ padding: "12px" }}>{u.village}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MakeVillageAdmin;
