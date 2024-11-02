import React, { useContext, useState, useEffect } from "react";
import Header from "../Header/Header";
import { AuthContext } from "../../context/AuthContext";
import {
  FaUsers,
  FaTasks,
  FaClipboardList,
  FaPlusCircle,
  FaClock,
} from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const { userRole, setUserRole } = useContext(AuthContext);
  const [buttons, setButtons] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");
    };
    updateGreeting();
    const interval = setInterval(() => {
      updateGreeting();
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
          setUserRole(data.role); // Set role in the context
        } else {
          console.error("Failed to fetch profile data.");
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
      setLoading(false); // Ensure loading is set to false after fetching
    };

    fetchProfile();
  }, [setUserRole]);

  useEffect(() => {
    if (userRole === "admin") {
      setButtons([
        {
          icon: <FaUsers />,
          label: "All Users",
          link: "/allusers",
          color: "blue",
        },
        {
          icon: <FaTasks />,
          label: "All Tasks",
          link: "/alltasks",
          color: "purple",
        },
        {
          icon: <FaClipboardList />,
          label: "My Tasks",
          link: "/mytasks",
          color: "green",
        },
        {
          icon: <FaPlusCircle />,
          label: "Create Task",
          link: "/createtask",
          color: "orange",
        },
      ]);
    } else {
      setButtons([
        {
          icon: <FaClipboardList />,
          label: "My Tasks",
          link: "/mytasks",
          color: "green",
        },
        {
          icon: <FaPlusCircle />,
          label: "Create Task",
          link: "/createtask",
          color: "orange",
        },
      ]);
    }
  }, [userRole]);

  if (loading) {
    return <div className="loader"></div>;
  }

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>
            {greeting}, {username || "User"}!
          </h1>
          <p className="current-time">
            <FaClock /> {currentTime}
          </p>
        </div>
      </div>
      <div className="dashboard-main">
        <h2>Quick Actions</h2>
        <div className="dashboard-buttons">
          {buttons.map((button, index) => (
            <a
              key={index}
              href={button.link}
              className={`dashboard-button ${button.color}`}
            >
              <div className="dashboard-icon">{button.icon}</div>
              <span>{button.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
