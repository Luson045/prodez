// App.js
import React from 'react';
import LineChart from './LineChart';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useMediaQuery } from 'react-responsive';
import '../css/Data2.css';

const App = () => {
  // Example data
  const userId = localStorage.getItem('userid');
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  return (
    <>
    {isDesktop && <Navbar />}
    {isMobile && <BottomNavbar />}
    <div className="App">
      <h1>My Data</h1>
      <div className="data-container">
        <LineChart userId={userId}/>
      </div>
    </div>
    </>
  );
};

export default App;
