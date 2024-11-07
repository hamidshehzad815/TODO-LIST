import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./Analytics.css";

const TaskAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalTasks: 8,
    completedTasks: 5,
    pendingTasks: 3,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:8000/tasks/mytaskAnalytics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAnalytics(data);
        } else {
          console.log("not ok");
        }
      } catch (error) {
        console.error("Error fetching the analytics:", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Total Tasks", "Completed Tasks", "Pending Tasks"],
    datasets: [
      {
        label: "Tasks",
        data: [
          analytics.totalTasks,
          analytics.completedTasks,
          analytics.pendingTasks,
        ],
        backgroundColor: ["#667eea", "#38a169", "#e53e3e"],
        borderColor: ["#5a67d8", "#2f855a", "#c53030"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-container">
      <h1>My Task Analytics</h1>
      <div className="chart-container">
        <Bar data={data} />
      </div>
      <div className="summary-container">
        <div className="summary-card">
          <h2>Total Tasks</h2>
          <p>{analytics.totalTasks}</p>
        </div>
        <div className="summary-card">
          <h2>Completed Tasks</h2>
          <p>{analytics.completedTasks}</p>
        </div>
        <div className="summary-card">
          <h2>Pending Tasks</h2>
          <p>{analytics.pendingTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskAnalytics;
