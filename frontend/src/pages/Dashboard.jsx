import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../services/carService.js';
import { bidService } from '../services/bidService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatINR, timeLeft } from '../utils/format.js';

export default function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [bidsByCar, setBidsByCar] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await carService.list();
        if (cancelled) return;
        setCars(list);
        const entries = await Promise.all(
          list.map((c) => bidService.forCar(c.id).then((b) => [c.id, b]).catch(() => [c.id, []]))
        );
        if (cancelled) return;
        setBidsByCar(Object.fromEntries(entries));
      } catch (e) {
        setError(e?.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const { active, won } = useMemo(() => {
    const active = []; const won = [];
    for (const c of cars) {
      const bids = bidsByCar[c.id] || [];
      const myBids = bids.filter((b) => b.bidderName === user?.name);
      if (myBids.length === 0) continue;
      const highest = [...bids].sort((a, b) => b.amount - a.amount)[0];
      const isHighest = highest && highest.bidderName === user?.name;
      const ended = timeLeft(c.auctionEndTime) === 'Ended';
      if (ended) {
        if (isHighest) won.push({ car: c, bid: highest });
      } else {
        active.push({ car: c, myMax: Math.max(...myBids.map((b) => b.amount)), highest, isHighest });
      }
    }
    return { active, won };
  }, [cars, bidsByCar, user]);

  if (loading) return <p className="mx-auto max-w-7xl px-6 py-20 text-text-muted">Loading…</p>;
  if (error) return <p className="mx-auto max-w-7xl px-6 py-20 text-red-400">{error}</p>;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="font-display text-3xl font-extrabold">Hi, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="mt-1 text-sm text-text-secondary">Your bidding activity across BidDrive.</p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-bold">Active bids ({active.length})</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">You have no active bids. <Link to="/" className="text-accent hover:underline">Browse auctions →</Link></p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {active.map(({ car, myMax, highest, isHighest }) => (
              <Link key={car.id} to={`/cars/${car.id}`} className="card transition hover:border-accent/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-bold">{car.make} {car.model}</p>
                    <p className="text-xs text-text-muted">{timeLeft(car.auctionEndTime)}</p>
                  </div>
                  <span className={`badge ${isHighest ? 'border-accent/40 text-accent' : 'border-bg-border text-text-secondary'}`}>
                    {isHighest ? 'You lead' : 'Outbid'}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-text-muted">Your max</p>
                    <p className="font-semibold">{formatINR(myMax)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-text-muted">Highest</p>
                    <p className="font-semibold text-accent">{formatINR(highest?.amount)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-bold">Won auctions ({won.length})</h2>
        {won.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No wins yet — keep bidding!</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {won.map(({ car, bid }) => (
              <Link key={car.id} to={`/cars/${car.id}`} className="card transition hover:border-accent/50">
                <p className="font-display text-base font-bold">{car.make} {car.model}</p>
                <p className="mt-1 text-xs text-text-muted">Won at</p>
                <p className="font-display text-2xl font-extrabold text-accent">{formatINR(bid.amount)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
