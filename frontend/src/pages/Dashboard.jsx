
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api"; // 🔥 IMPORTANT

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/tasks");
        setTasks(res.data || []);
      } catch (err) {
        console.log("GET ERROR:", err.message);
      }
    };

    if (token) fetchTasks();
  }, [token]);

  const addTask = async () => {
    if (!title.trim()) return;

    try {
      if (editId) {
        const res = await API.put(`/tasks/${editId}`, {
          title,
        });

        setTasks(
          tasks.map((t) =>
            t._id === editId ? res.data : t
          )
        );

        setEditId(null);
        setTitle("");
        return;
      }

      const res = await API.post("/tasks", {
        title,
      });

      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) {
      console.log("ADD ERROR:", err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);

      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.message);
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, {
        status:
          task.status === "pending"
            ? "completed"
            : "pending",
      });

      setTasks(
        tasks.map((t) =>
          t._id === task._id ? res.data : t
        )
      );
    } catch (err) {
      console.log("TOGGLE ERROR:", err.message);
    }
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard">

      <Navbar logout={logout} />

      <div className="layout">

        <Sidebar />

        <div className="content">

          <div className="stats">
            <div className="stat-card">
              Total: {tasks.length}
            </div>
            <div className="stat-card">
              Completed: {tasks.filter(t => t.status === "completed").length}
            </div>
            <div className="stat-card">
              Pending: {tasks.filter(t => t.status === "pending").length}
            </div>
          </div>

          <div className="card">
            <h2>{editId ? "Edit Task" : "Create Task"}</h2>

            <div className="input-row">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task..."
              />

              <button onClick={addTask}>
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>

          <div className="task-grid">
            {tasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  deleteTask={deleteTask}
                  toggleTask={toggleTask}
                  editTask={editTask}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
