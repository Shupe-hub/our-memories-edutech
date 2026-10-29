import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import './App.css';

function App() {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <Router>
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header toggleTheme={toggleTheme} theme={theme} />

                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </main>

                <Footer />
            </div>

            {/* Floating Toggle Button */}
            <button onClick={toggleTheme} className="floating-theme-toggle" aria-label="Toggle Dark Mode">
                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>

        </Router>
    );
}

export default App;