import React, { useEffect, useState } from "react";
import "./MyTasks.css";

import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterConfig, setFilterConfig] = useState({
    column: "status",
    value: "ALL",
  });
  const [sortConfig, setSortConfig] = useState({
    field: "dueDate",
    order: "asc",
  });
  const [showConfirmation, setShowConfirmation] = useState({
    show: false,
    taskId: null,
  });
  const [showUpdateForm, setShowUpdateForm] = useState({
    show: false,
    task: null,
  });
  const [showComments, setShowComments] = useState({
    show: false,
    taskId: null,
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks();
  }, [filterConfig, sortConfig]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url;
      if (filterConfig.value === "ALL") {
        url = `http://localhost:8000/tasks/taskBy/${sortConfig.field}/${sortConfig.order}`;
      } else {
        url = `http://localhost:8000/tasks/taskFilter/${filterConfig.column}/${filterConfig.value}`;
      }
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
        setError("");
      } else {
        setTasks([]);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/comments/getComments/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch comments.");
      }
    } catch (error) {
      setError("An error occurred while fetching comments.");
    }
  };

  const handleAddComment = async (taskId) => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/comments/createComment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            taskId,
            commentBody: newComment,
          }),
        }
      );

      if (response.ok) {
        await fetchComments(taskId); // Fetch all comments again after adding
        setNewComment("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to add comment.");
      }
    } catch (error) {
      setError("An error occurred while adding the comment.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";

      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleDelete = (taskId) => {
    setShowConfirmation({ show: true, taskId });
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/tasks/delete-task/${showConfirmation.taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setTasks(
          tasks.filter((task) => task.taskId !== showConfirmation.taskId)
        );
        setShowConfirmation({ show: false, taskId: null });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete task.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const cancelDelete = () => {
    setShowConfirmation({ show: false, taskId: null });
  };

  const handleUpdate = (task) => {
    setShowUpdateForm({ show: true, task });
  };

  const handleShowComments = (taskId) => {
    setShowComments({ show: true, taskId });
    fetchComments(taskId);
  };

  const updateTask = async (e) => {
    e.preventDefault();
    const { taskId, title, description, dueDate, priority, status } =
      showUpdateForm.task;
    const token = localStorage.getItem("token");
    const payload = { title };
    if (description) payload.description = description;
    if (dueDate) payload.dueDate = dueDate;
    if (priority) payload.priority = priority;
    if (!priority) payload.priority = "low";
    if (status) payload.status = status;
    if (!status) payload.status = "pending";
    try {
      const response = await fetch(
        `http://localhost:8000/tasks/updateTask/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        fetchTasks();
        setShowUpdateForm({ show: false, task: null });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update task.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShowUpdateForm((prev) => ({
      show: prev.show,
      task: { ...prev.task, [name]: value },
    }));
  };

  if (loading) {
    return <div className="loader"></div>;
  }
  const goBack = () => {
    navigate(-1); // Navigate back to the previous page in history
  };
  return (
    <div className="my-tasks-container">
      {error && <div className="error-message">{error}</div>}

      {showConfirmation.show && (
        <div className="confirmation-overlay">
          <div className="confirmation-box">
            <p>Are you sure you want to delete this task?</p>
            <div className="confirmation-buttons">
              <button onClick={confirmDelete} className="btn-confirm">
                Yes
              </button>
              <button onClick={cancelDelete} className="btn-cancel">
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showUpdateForm.show && (
        <div className="update-form-overlay">
          <form onSubmit={updateTask} className="update-form">
            <h3>Update Task</h3>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={showUpdateForm.task.title}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={showUpdateForm.task.description}
                onChange={handleChange}
              />
            </label>
            <label>
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={showUpdateForm.task.dueDate}
                onChange={handleChange}
              />
            </label>
            <label>
              Priority:
              <select
                name="priority"
                value={showUpdateForm.task.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Status:
              <select
                name="status"
                value={showUpdateForm.task.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <div className="update-form-buttons">
              <button type="submit" className="btn-update">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowUpdateForm({ show: false, task: null })}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showComments.show && (
        <div className="comments-overlay">
          <div className="comments-box">
            <div className="comments-header">
              <h3>Comments</h3>
              <button
                className="close-button"
                onClick={() => {
                  setShowComments({ show: false, taskId: null });
                  setComments([]); // Clear comments when closing
                }}
              >
                ×
              </button>
            </div>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.commentId} className="comment">
                    <div className="comment-header">
                      <span className="comment-date">
                        {formatDate(comment.createdAt)}
                      </span>
                      <span>{comment.username}</span>
                    </div>
                    <p className="comment-content">{comment.commentBody}</p>
                  </div>
                ))
              )}
            </div>
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows="3"
              />
              <button
                onClick={() => handleAddComment(showComments.taskId)}
                className="btn-comment"
                disabled={!newComment.trim()}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
      <Header className="rounded"/>
      <button onClick={goBack} className="back-button">
        &#8592;
      </button>
      <div className="tasks-header">
        <h2>My Tasks</h2>
        <div className="tasks-controls">
          <select
            className="filter-select"
            value={filterConfig.value}
            onChange={(e) =>
              setFilterConfig({ column: "status", value: e.target.value })
            }
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            className="filter-select"
            value={`${sortConfig.field}_${sortConfig.order}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("_");
              setSortConfig({ field, order });
            }}
          >
            <option value="dueDate_asc">Due Date (Ascending)</option>
            <option value="dueDate_desc">Due Date (Descending)</option>
            <option value="priority_asc">Priority (Ascending)</option>
            <option value="priority_desc">Priority (Descending)</option>
            <option value="status_asc">Status (Ascending)</option>
            <option value="status_desc">Status (Descending)</option>
          </select>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks found.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.taskId} className="task-card">
              <div className="task-header">
                <h3>{task.title || "Untitled Task"}</h3>
                <span
                  className={`priority-badge ${
                    task.priority?.toLowerCase() || "low"
                  }`}
                >
                  {task.priority || "LOW"}
                </span>
              </div>
              <p className="task-description">
                {task.description || "No description provided"}
              </p>
              <div className="task-details">
                <p className="due-date">Due: {formatDate(task.dueDate)}</p>
                <span
                  className={`status-badge ${(
                    task.status || "pending"
                  ).toLowerCase()}`}
                >
                  {(task.status || "PENDING").replace("_", " ")}
                </span>
                <div className="task-assignee">
                  <p>Created by: {task.createdByEmail || "Unknown"}</p>
                  <p>Assigned to: {task.assignedToEmail || "Unassigned"}</p>
                </div>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => handleUpdate(task)}
                  className="btn-update"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(task.taskId)}
                  className="btn-delete"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleShowComments(task.taskId)}
                  className="btn-comments"
                >
                  Comments
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
