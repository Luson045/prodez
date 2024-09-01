// Make sure to include these imports:
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: "../.env" });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/process-todos', async (req, res) => {
  const { todos,mood } = req.body;

  if (!todos || todos.length === 0) {
    return res.status(400).json({ message: 'No todos provided' });
  }

  try {
    const prompt = `[${todos.toString()}], this is my list of tasks to do today. I am currently feeling ${mood}, so order the list accordingly priority-wise according to my mood. Not a single extra word should be there in the response. Just arrange the to-do list according to my mood.NOTE:DONT MAKE ANY CHANGE IN MY TODO LIST CONTENT AND DONT ADD ANY NEW ITEM`;

    const result = await model.generateContent(prompt);
    const resp = result.response;
    const text = resp.text();

    // Convert the text output back into an array
    const processedTodos = text.replace(/[\[\]']/g, "").split(",").map(item => item.trim());

    res.json({ processedTodos });
  } catch (error) {
    console.error('Error processing todos:', error);
    res.status(500).json({ message: 'Error processing todos' });
  }
});
router.post('/generate-todos', async (req, res) => {
  const { act } = req.body;
  try {
    const prompt = `"${act}", this is my condition and needs.According to my needs generate a to-do list(list of things to do everyday). Not a single extra word should be there in the response. Just generate a very detailed and curated to-do list according to my needs and it should be a list. Example: [task1,task2,...].Write it in exactly the same format as in example. Not a single other format!`;
    const result = await model.generateContent(prompt);
    const resp = result.response;
    const text = resp.text();
    const processedTodos = text.replace(/[\[\]']/g, "").split(",").map(item => item.trim());
    res.json({ processedTodos });
  } catch (error) {
    console.error('Error generating todos:', error);
    res.status(500).json({ message: 'Error generating todos' });
  }
});

module.exports = router;