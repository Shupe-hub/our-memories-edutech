import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import './AuthPage.css';

const AuthPage = ({ mode }) => {
    const isRegister = mode === 'register';
    const { isLoading, signIn, user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return <main className="auth-page"><p className="auth-loading">Checking your account…</p></main>;
    }

    if (user) {
        return <Navigate to="/account" replace />;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const values = Object.fromEntries(formData.entries());
        try {
            await signIn(isRegister ? 'register' : 'login', values);
            navigate('/account', { replace: true });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-card" aria-labelledby="auth-title">
                <p className="auth-eyebrow">OUR MEMORIES EDUTECH</p>
                <h1 id="auth-title">{isRegister ? 'Create your account' : 'Welcome back'}</h1>
                <p className="auth-intro">
                    {isRegister
                        ? 'Register to get started.'
                        : 'Sign in to your account.'}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <label htmlFor="name">Name</label>
                            <input id="name" name="name" type="text" autoComplete="given-name" required />
                            <label htmlFor="surname">Surname</label>
                            <input id="surname" name="surname" type="text" autoComplete="family-name" required />
                        </>
                    )}
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" autoComplete="email" required />
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        minLength={isRegister ? 8 : undefined}
                        required
                    />
                    {error && <p className="auth-error" role="alert">{error}</p>}
                    <button className="auth-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Please wait…' : isRegister ? 'Create account' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-switch">
                    {isRegister ? 'Already have an account?' : 'New to Our Memories EduTech?'}{' '}
                    <Link to={isRegister ? '/login' : '/register'}>
                        {isRegister ? 'Sign in' : 'Create an account'}
                    </Link>
                </p>
            </section>
        </main>
    );
};

export default AuthPage;
