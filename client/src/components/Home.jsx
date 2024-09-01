import React, { useEffect, useState, useRef } from 'react';
import '../css/Home.css';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { useMediaQuery } from 'react-responsive';

function Home() {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardsRef = useRef([]);
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  const cards = [
    { title: " Dynamic To-Do List", content: "We provide a seemless and dynamic UI to add and remove to-do's" },
    { title: "AI based task", content: "Don't know what to do RIGHT NOW? Ask AI!" },
    { title: "AI Generated Schedule", content: "Generate a schedule for a task using AI." },
    { title: "Personalized Tasks", content: "Tasks according to your profession and needs." },
    { title: "Progress Data", content: "Keep track of your progress with real time graphs." },
    { title: "Email Validation", content: "For user registration we will verify the email, to detect frauds." }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = cardsRef.current.findIndex(ref => ref === entry.target);
          setVisibleCards(prev => [...new Set([...prev, index])]);
        }
      });
    }, observerOptions);

    cardsRef.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
    {isDesktop && <Navbar />}
    {isMobile && <BottomNavbar />}
    <div className="home-container">
      <div className="hero">
        <h1>Productivity made ezzz</h1>
        <p>Leverage the power of algorithm and AI to boost your productivity!</p>
        <a href='/list'>Get Started</a>
      </div>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div 
            key={index} 
            ref={el => cardsRef.current[index] = el}
            className={`card ${visibleCards.includes(index) ? 'visible' : ''} ${index % 2 === 0 ? 'left' : 'right'}`}
          >
            <h2>{card.title}</h2>
            <p>{card.content}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Home;