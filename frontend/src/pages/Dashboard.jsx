import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const [filter, setFilter] = useState("all"); // 🔥 filter
  const [search, setSearch] = useState(""); // 🔍 search

  const token = localStorage.getItem("token");

  // 🔐 AUTH CHECK
  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  // 📥 GET TASKS FROM DB
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

  // ➕ CREATE / ✏️ UPDATE
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      if (editId) {
        const res = await API.put(`/tasks/${editId}`, { title });

        setTasks(tasks.map(t => t._id === editId ? res.data : t));

        setEditId(null);
        setTitle("");
        return;
      }

      const res = await API.post("/tasks", { title });

      setTasks([...tasks, res.data]);
      setTitle("");
    } catch (err) {
      console.log("ADD ERROR:", err.message);
    }
  };

  // ❌ DELETE
  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.log("DELETE ERROR:", err.message);
    }
  };

  // 🔁 TOGGLE
  const toggleTask = async (task) => {
    try {
      const res = await API.put(`/tasks/${task._id}`, {
        status: task.status === "pending" ? "completed" : "pending",
      });

      setTasks(tasks.map(t => t._id === task._id ? res.data : t));
    } catch (err) {
      console.log("TOGGLE ERROR:", err.message);
    }
  };

  // ✏️ EDIT
  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔥 FILTER + SEARCH LOGIC
  const filteredTasks = tasks
    .filter(task => {
      if (filter === "all") return true;
      return task.status === filter;
    })
    .filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="dashboard">

      <Navbar logout={logout} />

      <div className="layout">

        <Sidebar />

        <div className="content">

          {/* STATS */}
          <div className="stats">
            <div className="stat-card">Total: {tasks.length}</div>
            <div className="stat-card">Completed: {tasks.filter(t => t.status === "completed").length}</div>
            <div className="stat-card">Pending: {tasks.filter(t => t.status === "pending").length}</div>
          </div>

          {/* FILTER + SEARCH */}
          <div className="card">

            <div className="input-row">

              {/* SEARCH */}
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search task..."
                  style={{ paddingLeft: "35px" }}
                />

                <span style={{
                  position: "absolute",
                  left: "10px",
                  top: "10px",
                  color: "#888"
                }}>
                  🔍
                </span>
              </div>

              {/* FILTER */}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

            </div>

          </div>

          {/* CREATE / EDIT */}
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

          {/* TASK LIST */}
          <div className="task-grid">
            {filteredTasks.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              filteredTasks.map(task => (
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
