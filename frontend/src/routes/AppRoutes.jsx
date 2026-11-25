import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import Header from '../components/public/Header';
import Footer from '../components/public/Footer';
import ScrollToTop from '../components/shared/ScrollToTop';
import { useAuth } from '../hooks/useAuth';
import { AuthProvider } from '../auth/AuthProvider';

import Home from '../pages/public-pages/Home';
import About from '../pages/public-pages/About';
import Pricing from '../pages/public-pages/Pricing';
import Contact from '../pages/public-pages/Contact';
import Education from '../pages/public-pages/education/Education';
import OnlineTutoring from '../pages/public-pages/education/OnlineTutoring';
import GradeSubjects from '../pages/public-pages/education/GradeSubjects';
import ExamPreparation from '../pages/public-pages/education/ExamPreparation';
import StudyResources from '../pages/public-pages/education/StudyResources';
import CareerGuidance from '../pages/public-pages/education/CareerGuidance';
import MeetOurTutors from '../pages/public-pages/education/MeetOurTutors';
import Applications from '../pages/public-pages/applications/Applications';
import UniversityApplications from '../pages/public-pages/applications/UniversityApplications';
import TVETApplications from '../pages/public-pages/applications/TVETApplications';
import SchoolApplications from '../pages/public-pages/applications/SchoolApplications';
import BursaryApplications from '../pages/public-pages/applications/BursaryApplications';
import NSFASApplications from '../pages/public-pages/applications/NSFASApplications';
import CAOApplications from '../pages/public-pages/applications/CAOApplications';
import ApplicationEnquiryPage from '../pages/public-pages/Applications/ApplicationEnquiryPage';
import LegalInformation from '../pages/public-pages/LegalInformation';
import CareerServices from '../pages/public-pages/career-services/CareerServices';
import CVPreparation from '../pages/public-pages/career-services/CVPreparation';
import CoverLetters from '../pages/public-pages/career-services/CoverLetters';
import JobApplications from '../pages/public-pages/career-services/JobApplications';
import InternshipsLearnerships from '../pages/public-pages/career-services/InternshipsLearnerships';
import GraduateProgrammes from '../pages/public-pages/career-services/GraduateProgrammes';
import Gallery from '../pages/public-pages/gallery/Gallery';
import AuthPage from '../pages/auth-pages/AuthPage';
import ForgotPasswordPage from '../pages/auth-pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth-pages/ResetPasswordPage';
import AdminDashboard from '../pages/admin-pages/AdminDashboard';
import SystemAdminDashboard from '../pages/system-admin-pages/SystemAdminDashboard';
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import SystemAdminLayout from '../layouts/SystemAdminLayout';
import { ApplicationDraftProvider } from '../context/ApplicationDraftContext';

import '../styles/App.css';

const DashboardLayout = lazy(() => import('../layouts/UserLayout'));
const DashboardOverview = lazy(() => import('../pages/user-pages/AccountPage'));
const DashboardApplications = lazy(() => import('../pages/user-pages/MyApplicationsPage'));
const NewEnquiryPage = lazy(() => import('../pages/user-pages/Applications/NewEnquiryPage'));
const EnquiryDetailsPage = lazy(() => import('../pages/user-pages/Applications/ApplicationDetailsPage'));
const EditEnquiryPage = lazy(() => import('../pages/user-pages/Applications/EditEnquiryPage'));
const InstitutionExplorer = lazy(() => import('../pages/user-pages/InstitutionDirectoryPage'));
const FundingPage = lazy(() => import('../pages/user-pages/FundingPage'));
const DocumentsPage = lazy(() => import('../pages/user-pages/DocumentsPage'));
const NotificationsPage = lazy(() => import('../pages/user-pages/NotificationsPage'));
const ProfilePage = lazy(() => import('../pages/user-pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/user-pages/SettingsPage'));
const UniversityApplicationsPage = lazy(() => import('../pages/user-pages/EducationWorkflowPages').then((module) => ({ default: module.UniversityApplicationsPage })));
const BursaryApplicationsPage = lazy(() => import('../pages/user-pages/EducationWorkflowPages').then((module) => ({ default: module.BursaryApplicationsPage })));
const BursaryDirectoryPage = lazy(() => import('../pages/user-pages/EducationWorkflowPages').then((module) => ({ default: module.BursaryDirectoryPage })));
const DeadlinesPage = lazy(() => import('../pages/user-pages/EducationWorkflowPages').then((module) => ({ default: module.DeadlinesPage })));

function ProtectedStudentRoutes() {
    const { isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div className="student-auth-loading" role="status">Checking your student account...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }
    if (user.role !== 'STUDENT') return <Navigate to={user.mustChangePassword ? '/admin/change-password' : user.role === 'SUPER_ADMIN' ? '/system-admin' : '/admin'} replace />;

    return <Outlet />;
}

function AppShell({ theme, toggleTheme }) {
    const { user, isLoading } = useAuth();
    const location = useLocation();
    const isStudentDashboard = location.pathname.startsWith('/account');
    const isAdminDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/system-admin');
    const authenticated = Boolean(user);
    const dashboardPath = user?.mustChangePassword ? '/admin/change-password' : user?.role === 'SUPER_ADMIN' ? '/system-admin' : user?.role === 'ADMIN' ? '/admin' : '/account';
    const isPublicRoute = !['/login', '/register', '/forgot-password', '/reset-password', '/applications/apply', '/account', '/admin', '/system-admin'].some((prefix) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`));
    const whatsappNumber = '27680513619';
    const whatsappMessage = 'Hello Our Memories EduTech, I would like assistance with...';
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className={`App${isStudentDashboard ? ' student-dashboard-app' : ''}`} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <ScrollToTop />
            {!authenticated && !isLoading && !isStudentDashboard && !isAdminDashboard && <Header toggleTheme={toggleTheme} theme={theme} />}

            <main style={{ flex: 1 }}>
                <Suspense fallback={<div className="student-auth-loading" role="status">Loading page...</div>}>
                    {authenticated && isPublicRoute ? <Navigate to={dashboardPath} replace /> : <Routes>
                        <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/pricing" element={<Pricing />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/education" element={<Education />} />
                        <Route path="/education/online-tutoring" element={<OnlineTutoring />} />
                        <Route path="/education/grade-subjects" element={<GradeSubjects />} />
                        <Route path="/education/exam-preparation" element={<ExamPreparation />} />
                        <Route path="/education/study-resources" element={<StudyResources />} />
                        <Route path="/education/career-guidance" element={<CareerGuidance />} />
                        <Route path="/education/meet-our-tutors" element={<MeetOurTutors />} />
                        <Route path="/applications" element={<Applications />} />
                        <Route path="/applications/university" element={<UniversityApplications />} />
                        <Route path="/applications/tvet" element={<TVETApplications />} />
                        <Route path="/applications/school" element={<SchoolApplications />} />
                        <Route path="/applications/bursaries" element={<BursaryApplications />} />
                        <Route path="/applications/nsfas" element={<NSFASApplications />} />
                        <Route path="/applications/cao" element={<CAOApplications />} />
                        <Route path="/applications/apply" element={<ApplicationEnquiryPage />} />
                        <Route path="/privacy" element={<LegalInformation />} />
                        <Route path="/terms" element={<LegalInformation />} />
                        <Route path="/refund" element={<LegalInformation />} />
                        <Route path="/career-services" element={<CareerServices />} />
                        <Route path="/career-services/cv-preparation" element={<CVPreparation />} />
                        <Route path="/career-services/cover-letters" element={<CoverLetters />} />
                        <Route path="/career-services/job-applications" element={<JobApplications />} />
                        <Route path="/career-services/internships-learnerships" element={<InternshipsLearnerships />} />
                        <Route path="/career-services/graduate-programmes" element={<GraduateProgrammes />} />
                        </Route>
                        <Route element={<AuthLayout />}>
                        <Route path="/login" element={<AuthPage mode="login" />} />
                        <Route path="/register" element={<AuthPage mode="register" />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        </Route>
                        <Route element={<SystemAdminLayout />}><Route path="/system-admin/*" element={<SystemAdminDashboard theme={theme} toggleTheme={toggleTheme} />} /></Route>
                        <Route element={<AdminLayout />}>
                            <Route path="/admin/change-password" element={<AdminDashboard changePassword theme={theme} toggleTheme={toggleTheme} />} />
                            <Route path="/admin/*" element={<AdminDashboard theme={theme} toggleTheme={toggleTheme} />} />
                        </Route>

                        <Route path="/account" element={<ProtectedStudentRoutes />}>
                            <Route element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}>
                                <Route index element={<DashboardOverview />} />
                                <Route path="applications" element={<DashboardApplications />} />
                                <Route path="university-applications" element={<UniversityApplicationsPage />} />
                                <Route path="bursary-applications" element={<BursaryApplicationsPage />} />
                                <Route path="bursaries" element={<BursaryDirectoryPage />} />
                                <Route path="deadlines" element={<DeadlinesPage />} />
                                <Route path="applications/new" element={<NewEnquiryPage />} />
                                <Route path="applications/:id" element={<EnquiryDetailsPage />} />
                                <Route path="applications/:id/edit" element={<EditEnquiryPage />} />
                                <Route path="explore" element={<InstitutionExplorer />} />
                                <Route path="funding" element={<FundingPage />} />
                                <Route path="documents" element={<DocumentsPage />} />
                                <Route path="notifications" element={<NotificationsPage />} />
                                <Route path="profile" element={<ProfilePage />} />
                                <Route path="settings" element={<SettingsPage />} />
                            </Route>
                        </Route>

                    </Routes>}
                </Suspense>
            </main>

            {!authenticated && !isLoading && !isStudentDashboard && !isAdminDashboard && <Footer />}
            {!authenticated && !isLoading && !isStudentDashboard && !isAdminDashboard && <div className="floating-buttons-container">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Chat on WhatsApp"><i className="fab fa-whatsapp" aria-hidden="true" /></a>
                <button type="button" onClick={toggleTheme} className="floating-theme-toggle" aria-label="Toggle dark mode"><i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" /></button>
            </div>}
        </div>
    );
}

function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme((current) => current === 'light' ? 'dark' : 'light');

    return (
        <Router>
            <ApplicationDraftProvider>
                <AuthProvider>
                    <AppShell theme={theme} toggleTheme={toggleTheme} />
                </AuthProvider>
            </ApplicationDraftProvider>
        </Router>
    );
}

export default App;
