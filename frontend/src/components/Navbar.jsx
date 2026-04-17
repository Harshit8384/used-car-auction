import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition ${isActive ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-bg-border bg-bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-black font-display font-extrabold">B</span>
          <span className="font-display text-lg font-extrabold tracking-tight">BidDrive</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink to="/" end className={linkCls}>Browse</NavLink>
          {user && <NavLink to="/dashboard" className={linkCls}>Dashboard</NavLink>}
          {hasRole('SELLER', 'ADMIN') && (
            <>
              <NavLink to="/sell/listings" className={linkCls}>My Listings</NavLink>
              <NavLink to="/sell/new" className={linkCls}>List a Car</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="hidden text-sm text-text-secondary hover:text-text-primary sm:inline">
                {user.name} <span className="ml-1 text-[10px] uppercase tracking-wider text-accent">{user.role}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost !py-2 !px-3 text-xs">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-text-secondary hover:text-text-primary">Login</Link>
              <Link to="/register" className="btn-primary !py-2 !px-4 text-xs">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
