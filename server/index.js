const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const User =require('./models/User');
const gemini = require('./routes/gemini');
userroutes = require('./modules/User/index');
require('dotenv').config({ path: "../.env" });
const app = express();
const port = 5000; 

const corsOptions = {
  origin: ['https://learnstocks.netlify.app','https://console.cron-job.org/','http://localhost:3000'], // Replace with your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.json());

mongoose.connect(`mongodb+srv://lusonbasumatary17:${process.env.DB_PASS}@todo.q8dvx.mongodb.net/?retryWrites=true&w=majority&appName=TODO`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all todos for a specific user
app.get('/todos/:userId', async (req, res) => {
  const { userId } = req.params;
  if(userId==null){
    return res.status(404).json({ message: 'User not found' });
  }
  const id = new ObjectId(userId.toString()); 
  try {
    const user = await User.findById(id, 'todos'); // Only fetch the todos field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new todo for a specific user
app.post('/todos/:userId', async (req, res) => {
  const { userId } = req.params;
  const { text } = req.body;
  if(userId==null){
    return res.status(404).json({ message: 'User not found' });
  }
  const id = new ObjectId(userId.toString());

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const date = new Date();
    user.todos.push({ text,date });
    await user.save();
    res.json(user.todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update a todo for a specific user
app.put('/todos/:userId/:todoId', async (req, res) => {
  const { userId, todoId } = req.params;
  const { text } = req.body;
  if(userId==null){
    return res.status(404).json({ message: 'User not found' });
  }
  const id = new ObjectId(userId.toString());

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todo = user.todos.id(todoId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.text = text;
    await user.save();
    res.json(user.todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/todos/score/:userId', async (req, res) => {
  const { userId} = req.params;
  if(userId===null){
    return res.status(404).json({ message: 'User not found' });
  }
  const id = new ObjectId(userId.toString());

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.score_hist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo for a specific user
app.delete('/todos/:userId/:todoId', async (req, res) => {
  const { userId, todoId } = req.params;
  
  if (!userId) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const id = new ObjectId(userId.toString());

  try {
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const todoIndex = user.todos.findIndex(todo => todo._id.toString() === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Calculate the difference in dates
    const currentDate = new Date(); // Current date
    const todoDate = new Date(user.todos[todoIndex].date);
    const differenceInTime = currentDate.getTime() - todoDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    // Deduct score by the difference in days
    if (differenceInDays < 1) {
      user.score += 1; // Add 1 if the difference is less than 1 day
    } else {
      user.score -= differenceInDays; // Deduct score based on the difference in days
    }

    // Update score history
    if (user.score_hist.length >= 30) {
      user.score_hist.shift();
    }
    
    user.score_hist.push({ score: user.score });

    // Remove the todo from the list
    user.todos.splice(todoIndex, 1);
    
    // Save the updated user data
    await user.save();

    res.json(user.todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.use('/ai', gemini);
app.use('/user', userroutes);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
