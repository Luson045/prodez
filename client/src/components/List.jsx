import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/TodoList.css'; // Add this line for external CSS
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useMediaQuery } from 'react-responsive';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const userId =localStorage.getItem('userid');
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  // Fetch all todos for the current user
  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/todos/${userId}`)
        .then(response => {
          setTodos(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the todos!', error);
        });
    }
  }, [userId]);

  // Handle adding a new todo
  const addTodo = () => {
    if (newTodo.trim() === '') return;
    axios.post(`http://localhost:5000/todos/${userId}`, { text: newTodo })
      .then(response => {
        setTodos(response.data);
        setNewTodo('');
      })
      .catch(error => {
        console.error('There was an error adding the todo!', error);
      });
  };

  // Handle deleting a todo
  const deleteTodo = (todoId) => {
    axios.delete(`http://localhost:5000/todos/${userId}/${todoId}`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('There was an error deleting the todo!', error);
      });
  };

  return (
    <>
    {isDesktop && <Navbar />}
    {isMobile && <BottomNavbar />}
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new task"
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-button">Add Todo</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            {todo.text} 
            <button onClick={() => deleteTodo(todo._id)} className="todo-delete-button">
              Done
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
};

export default TodoList;
