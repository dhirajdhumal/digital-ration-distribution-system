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
        const res = await api.get("/admin/users"); // one API returning both users & roles
        setUsers(res.data.users);
        setRoles(res.data.roles);
      } catch (err) {
        console.error(err);
        setMessage("❌ Failed to fetch data from database");
      }
    };
    fetchData();
  }, []);

useEffect(() => {
  if (message) {
    // Hide message after 3 seconds
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
      setMessage("✅ Role assigned successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="allocate-stock-container">
      <div className="card">
        <h2>Make Village Admin</h2>

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
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              required
            >
              <option value="">Select a User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.village})
                </option>
              ))}
            </select>
          </label>

          <label>
            Select Role:
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              disabled={loading}
              required
            >
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
        </form>
      </div>
    </div>
  );
}

export default MakeVillageAdmin;
