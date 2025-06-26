import React, { useState, useEffect } from 'react';
import './index.css';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    const clearCache = () => {
      const blob = new Blob([], { type: 'application/json' });
      navigator.sendBeacon('http://localhost:5000/api/clearcache', blob);
    };

    const handleBeforeUnload = (e) => {
      // Only clear cache if still on localhost and not navigating away
      if (window.location.hostname === 'localhost') {
        clearCache();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'explore':
        return <ExplorePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="bg-honeydew-900 min-h-screen">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
    </div>
  );
}