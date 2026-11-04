import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
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

    // DEFINE THE WHATSAPP LINK HERE
    const whatsappNumber = "27676916912"; 
    const whatsappMessage = "Hello Our Memories EduTech, I would like assistance with...";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Router>
            <ScrollToTop />
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header toggleTheme={toggleTheme} theme={theme} />

                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>

                <Footer />
            </div>

            {/* Floating Buttons Container */}
            <div className="floating-buttons-container">
                
                {/* WhatsApp Button */}
                <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="floating-whatsapp"
                    aria-label="Chat on WhatsApp"
                >
                    <i className="fab fa-whatsapp"></i>
                </a>

                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleTheme} 
                    className="floating-theme-toggle" 
                    aria-label="Toggle Dark Mode"
                >
                    <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                </button>
                
            </div>

        </Router>
    );
}

export default App;