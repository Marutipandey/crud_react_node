import "../styles/navbar.css";

const Navbar = ({ logout }) => {
  return (
    <div className="navbar">
      <h2>Task Manager</h2>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Navbar;
