import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = ({ userId, todoId }) => {
  const [scoreHist, setScoreHist] = useState([]);

  useEffect(() => {
    const fetchScoreHist = async () => {
      try {
        const response = await axios.get(`https://prodez-ai.onrender.com/todos/score/${userId}`);
        setScoreHist(response.data);
      } catch (error) {
        console.error('Error fetching score history:', error);
      }
    };

    fetchScoreHist();
  }, [userId, todoId]);

  // Prepare data for the chart
  const chartData = {
    labels: scoreHist.map((_, index) => index + 1), // Label with sequential numbers
    datasets: [
      {
        label: 'Score History',
        data: scoreHist.map(entry => entry.score),
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Game Number', // X-axis title
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score', // Y-axis title
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>Score History Line Chart</h2>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default LineChart;
