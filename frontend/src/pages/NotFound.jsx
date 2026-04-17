import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-display text-7xl font-extrabold text-accent">404</h1>
      <p className="mt-4 text-lg font-semibold">Page not found</p>
      <p className="mt-2 text-sm text-text-secondary">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
