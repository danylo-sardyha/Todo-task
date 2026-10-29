const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.ENUM("todo", "in progress", "done"),
    defaultValue: "todo",
  },
});

User.hasMany(Task);
Task.belongsTo(User);

module.exports = Task;
