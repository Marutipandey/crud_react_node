import "../styles/taskcard.css";

const TaskCard = ({ task, deleteTask, toggleTask, editTask }) => {
  return (
    <div className={`task-card ${task.status}`}>

      <div className="task-header">
        <h3>{task.title}</h3>

        <span className={`badge ${task.status}`}>
          {task.status}
        </span>
      </div>

      <div className="task-actions">

        <button
          className="toggle"
          onClick={() => toggleTask(task)}
        >
          Toggle
        </button>

        <button
          className="edit"
          onClick={() => editTask(task)}
        >
          Edit
        </button>

        <button
          className="delete"
          onClick={() => deleteTask(task._id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
};

export default TaskCard;
