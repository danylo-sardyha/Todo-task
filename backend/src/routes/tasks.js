const express = require("express");
const Task = require("../Models/task.js");
const auth = require("../middleware/auth");
const router = express.Router();

// Отримання завдань з фільтрацією
router.get("/", auth, async (req, res) => {
  try {
    const whereClause = { UserId: req.user.id };
    if (req.query.status) whereClause.status = req.query.status;

    const tasks = await Task.findAll({ where: whereClause });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Створення
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description, UserId: req.user.id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Оновлення
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = await Task.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.update({ title, description, status });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Видалення
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, UserId: req.user.id },
    });
    if (!task) return res.status(404).json({ error: "Task not found" });

    await task.destroy();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
