import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateTask.css";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const payload = { title };
      if (description) payload.description = description;
      if (dueDate) payload.dueDate = dueDate;
      if (priority) payload.priority = priority;
      if (status) payload.status = status;
      if (assignedTo) payload.assignedTo = assignedTo;

      const response = await fetch("http://localhost:8000/tasks/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSuccess(responseData.message || "Task created successfully!");
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("");
        setStatus("");
        setAssignedTo("");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const errorData = await response.json();
        setError(
          errorData.errors.map((err) => err.msg).join(", ") ||
            errorData.message ||
            "Failed to create task."
        );
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-task-container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-field2">
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label htmlFor="title" className={title ? "active" : ""}>
            Title
          </label>
        </div>
        <div className="input-field2">
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="description" className={description ? "active" : ""}>
            Description
          </label>
        </div>
        <div className="input-field2">
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <label htmlFor="dueDate" className={dueDate ? "active" : ""}>
            Due Date
          </label>
        </div>
        <div className="input-field2">
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="">Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <label htmlFor="priority" className={priority ? "active" : ""}>
            Priority
          </label>
        </div>
        <div className="input-field2">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <label htmlFor="status" className={status ? "active" : ""}>
            Status
          </label>
        </div>
        <div className="input-field2">
          <input
            type="email"
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
          <label htmlFor="assignedTo" className={assignedTo ? "active" : ""}>
            Assigned To
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="btn-submit">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
