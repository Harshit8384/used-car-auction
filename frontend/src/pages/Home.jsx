import { useEffect, useMemo, useState } from 'react';
import { carService } from '../services/carService.js';
import CarCard from '../components/CarCard.jsx';

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    let mounted = true;
    carService.list()
      .then((data) => mounted && setCars(Array.isArray(data) ? data : []))
      .catch((e) => mounted && setError(e?.response?.data?.message || 'Could not load cars. Is the backend running?'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const brands = useMemo(() => {
    const set = new Set(cars.map((c) => c.make).filter(Boolean));
    return ['ALL', ...Array.from(set).sort()];
  }, [cars]);

  const filtered = useMemo(() => {
    return cars.filter((c) => {
      const text = `${c.make} ${c.model}`.toLowerCase();
      if (q && !text.includes(q.toLowerCase())) return false;
      if (brand !== 'ALL' && c.make !== brand) return false;
      if (maxPrice && Number(c.currentPrice ?? c.startingPrice) > Number(maxPrice)) return false;
      return true;
    });
  }, [cars, q, brand, maxPrice]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-bg-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.15),_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <span className="badge border-accent/40 text-accent">Live auctions</span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] md:text-6xl">
            Bid on the cars <span className="text-accent">you actually want.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-text-secondary">
            Curated used-car auctions. Transparent bidding. Real-time prices. No middlemen.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-3 md:grid-cols-[1fr_200px_180px]">
          <input
            className="input"
            placeholder="Search make or model…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="input" value={brand} onChange={(e) => setBrand(e.target.value)}>
            {brands.map((b) => <option key={b} value={b}>{b === 'ALL' ? 'All brands' : b}</option>)}
          </select>
          <input
            className="input"
            type="number"
            placeholder="Max price (₹)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        {loading && <p className="text-sm text-text-muted">Loading cars…</p>}
        {error && (
          <div className="card border-red-900/40 bg-red-950/20 text-sm text-red-300">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-text-muted">No cars match your filters.</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      </section>
    </div>
  );
}
