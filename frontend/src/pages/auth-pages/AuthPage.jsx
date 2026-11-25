
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/OM.png';
import './AuthPage.css';

const getRedirectPath = (user) => {
    if (user.mustChangePassword) return '/admin/change-password';
    if (user.role === 'SUPER_ADMIN') return '/system-admin';
    if (user.role === 'ADMIN') return '/admin';
    return '/account';
};

const AuthPage = ({ mode }) => {
    const isRegister = mode === 'register';
    const { isLoading, signIn, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const nextPath = () => {
        const requested = location.state?.from;
        const path = typeof requested === 'string' ? requested : requested?.pathname;
        if (path === '/applications/apply' || path === '/account/applications/new') return path;
        return getRedirectPath(user);
    };

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (isLoading) {
        return (
            <main className="auth-page">
                <p className="auth-loading">Checking your account…</p>
            </main>
        );
    }

    if (user) {
        return <Navigate to={nextPath()} replace state={{ resumeApplication: true, draftExpected: true }} />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const form = event.currentTarget;
        const formData = new FormData(form);
        const values = Object.fromEntries(formData.entries());

        values.email = values.email.trim().toLowerCase();

        if (isRegister) {
            values.name = values.name.trim();
            values.surname = values.surname.trim();
            if (values.password.length < 8) {
                setError('Choose a password with at least 8 characters.');
                return;
            }
            if (values.password !== values.confirmPassword) {
                setError('Your passwords do not match.');
                return;
            }
            delete values.confirmPassword;
        }

        setIsSubmitting(true);

        try {
            const current = await signIn(
                isRegister ? 'register' : 'login',
                values
            );

            if (!current) {
                throw new Error('Authentication failed. Please try again.');
            }

            form.reset();
            const requested = location.state?.from;
            const requestedPath = typeof requested === 'string' ? requested : requested?.pathname;
            const destination = requestedPath === '/applications/apply' || requestedPath === '/account/applications/new' ? requestedPath : getRedirectPath(current);
            navigate(destination, { replace: true, state: destination.includes('applications') ? { resumeApplication: true, draftExpected: true } : undefined });
        } catch (requestError) {
            setError(
                requestError.message || 'Something went wrong. Please try again.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <Link to="/" className="auth-home-link"><i className="fas fa-arrow-left" aria-hidden="true" /> Back to homepage</Link>
                <div className="auth-brand"><img src={logo} alt="Our Memories EduTech" /><span>OUR MEMORIES <strong>EDUTECH</strong></span></div>
                <p className="auth-eyebrow">{isRegister ? 'YOUR NEXT CHAPTER STARTS HERE' : 'YOUR LEARNING JOURNEY CONTINUES'}</p>

                <h1 id="auth-title">
                    {isRegister ? 'Create your account' : 'Welcome back'}
                </h1>

                <p className="auth-intro">
                    {isRegister
                        ? 'Build your future with a little support at every step.'
                        : 'Sign in to pick up right where you left off.'}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <label htmlFor="name">First name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="given-name"
                                placeholder="First name"
                                required
                            />

                            <label htmlFor="surname">Surname</label>
                            <input
                                id="surname"
                                name="surname"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Surname"
                                required
                            />
                        </>
                    )}

                    <label htmlFor="email">Email address</label>
                    <div className="auth-input-wrap"><i className="far fa-envelope" aria-hidden="true" /><input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        required
                    /></div>

                    <label htmlFor="password">Password</label>
                    <div className="auth-input-wrap"><i className="fas fa-lock" aria-hidden="true" /><input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        minLength={isRegister ? 8 : undefined}
                        placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                        required
                    /><button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" /></button></div>
                    {!isRegister && <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>}
                    {isRegister && <><label htmlFor="confirmPassword">Confirm password</label><div className="auth-input-wrap"><i className="fas fa-shield-halved" aria-hidden="true" /><input id="confirmPassword" name="confirmPassword" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" placeholder="Enter your password again" required /><button className="auth-password-toggle" type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}><i className={`far ${showConfirmation ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true" /></button></div></>}

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting
                            ? 'Please wait…'
                            : isRegister
                                ? 'Create account'
                                : 'Sign in'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister
                        ? 'Already have an account?'
                        : 'New to Our Memories EduTech?'}{' '}
                    <Link to={isRegister ? '/login' : '/register'}>
                        {isRegister ? 'Sign in' : 'Create an account'}
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default AuthPage;
