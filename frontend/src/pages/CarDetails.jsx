import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carService } from '../services/carService.js';
import { bidService } from '../services/bidService.js';
import BidForm from '../components/BidForm.jsx';
import { formatINR, formatDateTime, timeLeft } from '../utils/format.js';

export default function CarDetails() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  const load = useCallback(async () => {
    try {
      const [c, b] = await Promise.all([
        carService.get(id),
        bidService.forCar(id).catch(() => []),
      ]);
      setCar(c);
      setBids(Array.isArray(b) ? b : []);
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to load car.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  // Refresh bids every 10s for "real-time" highest bid display
  useEffect(() => {
    const t = setInterval(() => {
      bidService.forCar(id).then(setBids).catch(() => {});
      setTick((n) => n + 1);
    }, 10000);
    return () => clearInterval(t);
  }, [id]);

  if (loading) return <p className="mx-auto max-w-7xl px-6 py-20 text-text-muted">Loading…</p>;
  if (error || !car) return <p className="mx-auto max-w-7xl px-6 py-20 text-red-400">{error || 'Car not found.'}</p>;

  const sortedBids = [...bids].sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
  const highest = sortedBids[0]?.amount ?? car.currentPrice ?? car.startingPrice;
  const minBid = (highest || 0) + 1000;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <Link to="/" className="text-xs text-text-muted hover:text-accent">← Back to auctions</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: image + info */}
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-bg-border bg-bg-elevated">
            {car.imageUrl ? (
              <img src={car.imageUrl} alt={`${car.make} ${car.model}`} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-text-muted">No image</div>
            )}
          </div>

          <h1 className="mt-6 font-display text-3xl font-extrabold md:text-4xl">
            {car.make} {car.model} <span className="text-text-muted">· {car.year}</span>
          </h1>
          <p className="mt-2 text-sm text-text-secondary">Listed by {car.sellerName || 'Seller'}</p>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['Color', car.color],
              ['Mileage', `${(car.mileage ?? 0).toLocaleString()} km`],
              ['Fuel', car.fuelType],
              ['Transmission', car.transmission],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-bg-border bg-bg-surface p-4">
                <p className="text-[11px] uppercase tracking-wider text-text-muted">{k}</p>
                <p className="mt-1 text-sm font-semibold">{v || '—'}</p>
              </div>
            ))}
          </div>

          {car.description && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-bold">Description</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{car.description}</p>
            </div>
          )}
        </div>

        {/* Right: bidding panel */}
        <aside className="space-y-6">
          <div className="card">
            <p className="text-[11px] uppercase tracking-wider text-text-muted">Current highest bid</p>
            <p className="mt-1 font-display text-4xl font-extrabold text-accent">{formatINR(highest)}</p>
            <p className="mt-3 text-xs text-text-secondary">
              Starting price: {formatINR(car.startingPrice)} · {timeLeft(car.auctionEndTime)}
            </p>
            <p className="mt-1 text-[10px] text-text-muted">Auto-refreshes every 10s · last update {tick}×</p>
          </div>

          {timeLeft(car.auctionEndTime) === 'Ended' ? (
            <div className="card text-center text-sm text-text-secondary">
              This auction has ended.
            </div>
          ) : (
            <BidForm car={car} minBid={minBid} onPlaced={load} />
          )}

          <div className="card">
            <h3 className="font-display text-lg font-bold">Bid history</h3>
            {sortedBids.length === 0 ? (
              <p className="mt-3 text-sm text-text-muted">No bids yet — be the first.</p>
            ) : (
              <ul className="mt-3 divide-y divide-bg-border">
                {sortedBids.map((b, i) => (
                  <li key={b.id} className="flex items-center justify-between py-2.5 text-sm">
                    <div>
                      <span className={`mr-2 ${i === 0 ? 'text-accent font-semibold' : 'text-text-primary'}`}>
                        {formatINR(b.amount)}
                      </span>
                      <span className="text-xs text-text-muted">by {b.bidderName}</span>
                    </div>
                    <span className="text-xs text-text-muted">{formatDateTime(b.bidTime)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
