import React, { useEffect, useState, useContext } from "react";
import Header from "../Header/Header";
import { AuthContext } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import "./AllUsers.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState({
    visible: false,
    userId: null,
  });
  const { userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/users/allusers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch users.");
        }
      } catch (error) {
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/users/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setUsers(users.filter((user) => user.userId !== userId));
        setShowConfirm({ visible: false, userId: null });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete user.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const confirmDelete = (userId) => {
    setShowConfirm({ visible: true, userId });
  };

  if (loading) {
    return <div className="loader"></div>;
  }
  const goBack = () => {
    navigate(-1); // Navigate back to the previous page in history
  };
  return (
    <div className="all-users-container">
      <Header className="rounded"/>
      <button onClick={goBack} className="back-button">
        &#8592;
      </button>
      {error && <div className="error-message">{error}</div>}
      <h2>All Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  {user.role === "user" && (
                    <button
                      className="btn-delete"
                      onClick={() => confirmDelete(user.userId)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {showConfirm.visible && (
        <div className="confirmation-card">
          <p>Are you sure you want to delete this user?</p>
          <button
            className="btn-yes"
            onClick={() => handleDelete(showConfirm.userId)}
          >
            Yes
          </button>
          <button
            className="btn-no"
            onClick={() => setShowConfirm({ visible: false, userId: null })}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
