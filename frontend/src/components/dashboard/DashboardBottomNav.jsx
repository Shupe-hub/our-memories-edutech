import { NavLink } from 'react-router-dom';

const links = [
    { label: 'Home', to: '/account', icon: 'fa-house', end: true },
    { label: 'Applications', to: '/account/applications', icon: 'fa-file-lines' },
    { label: 'Explore', to: '/account/explore', icon: 'fa-compass' },
    { label: 'Funding', to: '/account/funding', icon: 'fa-award' },
    { label: 'Profile', to: '/account/profile', icon: 'fa-user' },
];

export default function DashboardBottomNav() {
    return (
        <nav className="student-bottom-nav" aria-label="Main student navigation">
            {links.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `student-bottom-link${isActive ? ' active' : ''}`}>
                    <i className={`fas ${item.icon}`} aria-hidden="true" />
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
}
