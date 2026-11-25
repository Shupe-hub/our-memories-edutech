import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { authRequest } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/OM.png';
import './AuthPage.css';

const passwordPolicy = (value) => value.length >= 12 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

export default function ResetPasswordPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const location = useLocation();
    const token = params.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        setError('');
        if (!token) { setError('This reset link is missing its token. Request a new link.'); return; }
        if (!passwordPolicy(password)) { setError('Use at least 12 characters, including uppercase, lowercase, and a number.'); return; }
        if (password !== confirmation) { setError('Your passwords do not match.'); return; }
        setLoading(true);
        try {
            const result = await authRequest('reset-password', { method: 'POST', body: JSON.stringify({ token, password }) });
            setComplete(true);
            try { await signOut(); } catch { /* The reset already invalidated server sessions. */ }
            navigate('/reset-password', { replace: true, state: { resetComplete: true } });
            setError(result.message || 'Your password has been reset.');
        } catch (requestError) {
            setError(requestError.message || 'This reset link is invalid or has expired. Request a new one.');
        } finally { setLoading(false); }
    };

    const done = complete || Boolean(location.state?.resetComplete);
    return <main className="auth-page"><section className="auth-card" aria-labelledby="reset-title">
        <Link to="/login" className="auth-home-link"><i className="fas fa-arrow-left" aria-hidden="true"/> Back to login</Link>
        <div className="auth-brand"><img src={logo} alt="Our Memories EduTech"/><span>OUR MEMORIES <strong>EDUTECH</strong></span></div>
        <p className="auth-eyebrow">ACCOUNT RECOVERY</p><h1 id="reset-title">{done ? 'Password updated' : 'Choose a new password'}</h1>
        {done ? <><p className="auth-success" role="status"><i className="fas fa-circle-check" aria-hidden="true"/>Your password has been reset. Sign in using your new password.</p><Link to="/login" className="auth-submit auth-submit-link">Go to sign in <i className="fas fa-arrow-right" aria-hidden="true"/></Link></> : <>
            <p className="auth-intro">Choose a strong password for your account. Reset links expire after 30 minutes and can only be used once.</p>
            <form className="auth-form" onSubmit={submit}>
                <label htmlFor="new-password">New password</label><div className="auth-input-wrap"><i className="fas fa-lock" aria-hidden="true"/><input id="new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength="12" required/><button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}><i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"/></button></div>
                <p className="auth-password-guidance">At least 12 characters, with uppercase and lowercase letters and a number.</p>
                <label htmlFor="confirm-new-password">Confirm new password</label><div className="auth-input-wrap"><i className="fas fa-shield-halved" aria-hidden="true"/><input id="confirm-new-password" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength="12" required/><button className="auth-password-toggle" type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'}><i className={`far ${showConfirmation ? 'fa-eye-slash' : 'fa-eye'}`} aria-hidden="true"/></button></div>
                {error && <p className="auth-error" role="alert"><i className="fas fa-circle-exclamation" aria-hidden="true"/>{error}</p>}
                <button className="auth-submit" disabled={loading}><span>{loading ? 'Updating password...' : 'Reset password'}</span><i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-arrow-right'}`} aria-hidden="true"/></button>
            </form>
        </>}
    </section></main>;
}
