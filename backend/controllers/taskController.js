const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title)
      return res.status(400).json({ msg: "Title required" });

    const task = await Task.create({
      title,
      user: req.user.id,
      status: "pending",
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET ALL (USER SPECIFIC)
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
