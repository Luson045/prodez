import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/TodoList.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useMediaQuery } from 'react-responsive';

//const userId = 'user123'; // Replace with dynamic user ID as needed

const ProcessedTodoList = () => {
  const [todos, setTodos] = useState([]);
  const [processedTodos, setProcessedTodos] = useState(null);
  const [error, setError] = useState('');
  const [mood, setMood] = useState('lazy'); // Default mood
  const [act, setAct] = useState('I am preparing for JEE Advance');
  let userId =localStorage.getItem('userid');
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  useEffect(() => {
    userId=userId?userId:"hello";
    axios.get(`http://localhost:5000/todos/${userId}`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the todos!', error);
        setError('Failed to fetch todos.');
      });
  }, [userId]);

  const sendTodos = () => {
    if (todos.length === 0) {
      setError('No todos to send!');
      return;
    }

    axios.post('http://localhost:5000/ai/process-todos', { todos: todos.map(todo => todo.text), mood })
      .then(response => {
        console.log("Response from backend:", response.data); // Debug log
        if (response.data.processedTodos) {
          setProcessedTodos(response.data.processedTodos);
          setError('');
        } else {
          setError('Failed to process todos.');
        }
      })
      .catch(error => {
        console.error('There was an error processing the todos!', error);
        setError('Failed to process todos.');
      });
  };

  const generateTodos = () => {
    axios.post('http://localhost:5000/ai/generate-todos', { act })
      .then(response => {
        console.log("Response from backend:", response.data); // Debug log
        if (response.data.processedTodos) {
          setProcessedTodos(response.data.processedTodos);
          setError('');
        } else {
          setError('Failed to generate todos.');
        }
      })
      .catch(error => {
        console.error('There was an error processing the todos!', error);
        setError('Failed to process todos.');
      });
  };

  return (
    <>
    {isDesktop && <Navbar />}
    {isMobile && <BottomNavbar />}
    <div className="todo-container">
      <h1>Processed Todo List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="input-container">
        <label>
          <span>Mood:</span>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood (e.g., lazy, energetic)"
          />
        </label>
        <button onClick={sendTodos} className="todo-action-button">Ask AI</button>
      </div>
      <div className="input-container">
        <label>
          <span>Description:</span>
          <input
            type="text"
            value={act}
            onChange={(e) => setAct(e.target.value)}
            placeholder="Enter your specific conditions and needs"
          />
        </label>
        <button onClick={generateTodos} className="todo-action-button">Generate with AI</button>
      </div>
      {processedTodos && processedTodos.length > 0 ? (
        <ul className="todo-list">
          {processedTodos.map((todo, index) => (
            <li key={index} className="todo-item">
              {todo}
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-todo-message">
          <p>
            ProdEZ AI can generate a curated to-do list according to your existing to-do list and obviously your mood ^^.<br />
            And if you don't have any to-do list yet, we can also recommend you a to-do list according to your profile.
          </p>
        </div>
      )}
    </div>
    </>
  );
};

export default ProcessedTodoList;
