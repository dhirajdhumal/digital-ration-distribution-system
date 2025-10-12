import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import AuthContext from "../../context/authContext";
import "./MakeVillageAdmin.css";

function MakeVillageAdmin() {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
        setRoles(res.data.roles);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch data from database");
      }
    };
    fetchData();
  }, []);

  // Auto-hide error messages after 3 seconds
  useEffect(() => {
    if (message && message.includes("❌")) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const resetForm = () => {
    setUserId("");
    setRoleId("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !roleId) {
      setMessage("❌ Please select both user and role");
      return;
    }

    try {
      setLoading(true);
      await api.post("/admin/make-village-admin", { userId, role: roleId });
      setMessage("✅ Role assigned successfully!"); // stays until next action
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign role"); // auto-hides after 3s
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Make Village Admin Here</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Select user:
          <select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Select role:
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
            <option value="">Select a Role</option>
            {roles.map((role) => (
              <option key={role.name} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Assigning..." : "Assign Role"}
        </button>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default MakeVillageAdmin;
