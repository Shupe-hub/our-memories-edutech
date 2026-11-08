
import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Education from './pages/education/Education';
import OnlineTutoring from './pages/education/OnlineTutoring';
import GradeSubjects from './pages/education/GradeSubjects';
import ExamPreparation from './pages/education/ExamPreparation';
import StudyResources from './pages/education/StudyResources';
import CareerGuidance from './pages/education/CareerGuidance';
import MeetOurTutors from './pages/education/MeetOurTutors';
import Applications from './pages/applications/Applications';
import UniversityApplications from './pages/applications/UniversityApplications';
import TVETApplications from './pages/applications/TVETApplications';
import SchoolApplications from './pages/applications/SchoolApplications';
import BursaryApplications from './pages/applications/BursaryApplications';
import NSFASApplications from './pages/applications/NSFASApplications';
import CAOApplications from './pages/applications/CAOApplications';
import ApplicationForm from './pages/applications/ApplicationForm';
import LegalInformation from './pages/LegalInformation';
import CareerServices from './pages/career-services/CareerServices';
import CVPreparation from './pages/career-services/CVPreparation';
import CoverLetters from './pages/career-services/CoverLetters';
import JobApplications from './pages/career-services/JobApplications';
import InternshipsLearnerships from './pages/career-services/InternshipsLearnerships';
import GraduateProgrammes from './pages/career-services/GraduateProgrammes';
import Gallery from './pages/gallery/Gallery';

import './App.css';

function App() {

    // Theme management
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(previous =>
            previous === 'light' ? 'dark' : 'light'
        );
    };

    // WhatsApp configuration
    const whatsappNumber = '27680513619';

    const whatsappMessage =
        'Hello Our Memories EduTech, I would like assistance with...';

    const whatsappLink =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <Router>

            <ScrollToTop />

            <div
                className="App"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh'
                }}
            >

                {/* HEADER */}
                <Header
                    toggleTheme={toggleTheme}
                    theme={theme}
                />

                {/* PAGE CONTENT */}
                <main style={{ flex: 1 }}>

                    <Routes>

                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/pricing"
                            element={<Pricing />}
                        />

                        <Route
                            path="/contact"
                            element={<Contact />}
                        />

                        <Route
                            path="/gallery"
                            element={<Gallery />}
                        />

                        {/* EDUCATION */}
                        <Route
                            path="/education"
                            element={<Education />}
                        />

                        <Route
                            path="/education/online-tutoring"
                            element={<OnlineTutoring />}
                        />

                        <Route
                            path="/education/grade-subjects"
                            element={<GradeSubjects />}
                        />

                        <Route
                           path="/education/exam-preparation"
                           element={<ExamPreparation />}
                        />

                        <Route
    path="/education/study-resources"
    element={<StudyResources />}
/>

<Route
    path="/education/career-guidance"
    element={<CareerGuidance />}
/>

<Route
    path="/education/meet-our-tutors"
    element={<MeetOurTutors />}
/>

                        {/* APPLICATIONS */}
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/applications/university" element={<UniversityApplications />} />
                        <Route path="/applications/tvet" element={<TVETApplications />} />
                        <Route path="/applications/school" element={<SchoolApplications />} />
                        <Route path="/applications/bursaries" element={<BursaryApplications />} />
                        <Route path="/applications/nsfas" element={<NSFASApplications />} />
                        <Route path="/applications/cao" element={<CAOApplications />} />
                        <Route path="/applications/apply" element={<ApplicationForm />} />
                        <Route path="/privacy" element={<LegalInformation />} />
                        <Route path="/terms" element={<LegalInformation />} />
                        <Route path="/refund" element={<LegalInformation />} />
                        {/* CAREER SERVICES */}
                        <Route path="/career-services" element={<CareerServices />} />
                        <Route path="/career-services/cv-preparation" element={<CVPreparation />} />
                        <Route path="/career-services/cover-letters" element={<CoverLetters />} />
                        <Route path="/career-services/job-applications" element={<JobApplications />} />
                        <Route path="/career-services/internships-learnerships" element={<InternshipsLearnerships />} />
                        <Route path="/career-services/graduate-programmes" element={<GraduateProgrammes />} />



                    </Routes>

                </main>

                {/* FOOTER */}
                <Footer />

            </div>

            {/* FLOATING BUTTONS */}
            <div className="floating-buttons-container">

                {/* WHATSAPP BUTTON */}
                <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="floating-whatsapp"
                    aria-label="Chat on WhatsApp"
                >
                    <i className="fab fa-whatsapp"></i>
                </a>

                {/* THEME TOGGLE BUTTON */}
                <button
                    onClick={toggleTheme}
                    className="floating-theme-toggle"
                    aria-label="Toggle Dark Mode"
                >
                    <i
                        className={`fas ${
                            theme === 'light'
                                ? 'fa-moon'
                                : 'fa-sun'
                        }`}
                    ></i>
                </button>

            </div>

        </Router>
    );
}

export default App;
