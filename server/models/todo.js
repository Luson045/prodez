const mongoose = require('mongoose');

// Define the schema
const todoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  todos: [{ text: String }],
});
const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
