import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/carService.js';
import { useAuth } from '../context/AuthContext.jsx';
import CarCard from '../components/CarCard.jsx';

export default function MyListings() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carService.list()
      .then((all) => {
        // Backend doesn't expose seller id in the list; filter by sellerName as best-effort.
        setCars(all.filter((c) => c.sellerName === user?.name));
      })
      .catch((e) => setError(e?.response?.data?.message || 'Could not load listings.'))
      .finally(() => setLoading(false));
  }, [user?.name]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold">My listings</h1>
          <p className="mt-1 text-sm text-text-secondary">Cars you've put up for auction.</p>
        </div>
        <Link to="/sell/new" className="btn-primary">+ List a car</Link>
      </div>

      <div className="mt-8">
        {loading && <p className="text-sm text-text-muted">Loading…</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {!loading && !error && cars.length === 0 && (
          <p className="text-sm text-text-muted">You haven't listed any cars yet.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((c) => <CarCard key={c.id} car={c} />)}
        </div>
      </div>
    </div>
  );
}
