import { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`sidebar ${open ? "show" : ""}`}>
        <h3>Menu</h3>
        <p>📊 Dashboard</p>
        <p>📝 Tasks</p>
        <p>⚙ Settings</p>
      </div>
    </>
  );
};

export default Sidebar;
