import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authRequest } from '../../services/api';
import logo from '../../assets/OM.png';
import './AuthPage.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const result = await authRequest('forgot-password', { method: 'POST', body: JSON.stringify({ email: email.trim().toLowerCase() }) });
            setMessage(result.message || 'If an account matches this address, you may receive password reset instructions.');
        } catch (requestError) {
            setError(requestError.message || 'We could not process your request. Please try again later.');
        } finally { setLoading(false); }
    };

    return <main className="auth-page"><section className="auth-card" aria-labelledby="forgot-title">
        <Link to="/login" className="auth-home-link"><i className="fas fa-arrow-left" aria-hidden="true"/> Back to login</Link>
        <div className="auth-brand"><img src={logo} alt="Our Memories EduTech"/><span>OUR MEMORIES <strong>EDUTECH</strong></span></div>
        <p className="auth-eyebrow">ACCOUNT RECOVERY</p><h1 id="forgot-title">Forgot your password?</h1>
        <p className="auth-intro">Enter your registered email address and we will send you a password reset link.</p>
        <form className="auth-form" onSubmit={submit}>
            <label htmlFor="recovery-email">Email address</label>
            <div className="auth-input-wrap"><i className="far fa-envelope" aria-hidden="true"/><input id="recovery-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required/></div>
            {message && <p className="auth-success" role="status"><i className="fas fa-circle-check" aria-hidden="true"/>{message}</p>}
            {error && <p className="auth-error" role="alert"><i className="fas fa-circle-exclamation" aria-hidden="true"/>{error}</p>}
            <button className="auth-submit" disabled={loading}><span>{loading ? 'Sending...' : 'Send reset link'}</span><i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`} aria-hidden="true"/></button>
        </form>
        <p className="auth-switch">Remembered your password? <Link to="/login">Sign in</Link></p>
    </section></main>;
}
