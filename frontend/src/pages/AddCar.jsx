import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../services/carService.js';

const empty = {
  make: '', model: '', year: new Date().getFullYear(), color: '',
  mileage: 0, fuelType: 'Petrol', transmission: 'Automatic',
  description: '', imageUrl: '', startingPrice: 0, auctionEndTime: '',
};

export default function AddCar() {
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        year: Number(form.year),
        mileage: Number(form.mileage),
        startingPrice: Number(form.startingPrice),
      };
      const created = await carService.create(payload);
      navigate(`/cars/${created.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create listing.');
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-extrabold">List a car for auction</h1>
      <p className="mt-2 text-sm text-text-secondary">Fill in your car's details. Bidders will see this immediately.</p>

      <form onSubmit={submit} className="card mt-8 grid gap-4 md:grid-cols-2">
        <div>
          <label className="label">Make</label>
          <input className="input" required value={form.make} onChange={set('make')} placeholder="Toyota" />
        </div>
        <div>
          <label className="label">Model</label>
          <input className="input" required value={form.model} onChange={set('model')} placeholder="Fortuner" />
        </div>
        <div>
          <label className="label">Year</label>
          <input className="input" type="number" required value={form.year} onChange={set('year')} />
        </div>
        <div>
          <label className="label">Color</label>
          <input className="input" required value={form.color} onChange={set('color')} placeholder="White" />
        </div>
        <div>
          <label className="label">Mileage (km)</label>
          <input className="input" type="number" required value={form.mileage} onChange={set('mileage')} />
        </div>
        <div>
          <label className="label">Fuel type</label>
          <select className="input" value={form.fuelType} onChange={set('fuelType')}>
            {['Petrol','Diesel','Electric','Hybrid','CNG'].map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Transmission</label>
          <select className="input" value={form.transmission} onChange={set('transmission')}>
            {['Automatic','Manual'].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Starting price (INR)</label>
          <input className="input" type="number" required value={form.startingPrice} onChange={set('startingPrice')} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Image URL</label>
          <input className="input" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://…" />
        </div>
        <div className="md:col-span-2">
          <label className="label">Auction end time</label>
          <input className="input" type="datetime-local" required value={form.auctionEndTime} onChange={set('auctionEndTime')} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Description</label>
          <textarea className="input min-h-[120px]" value={form.description} onChange={set('description')} placeholder="Condition, service history, accessories…" />
        </div>

        {error && <p className="md:col-span-2 text-xs text-red-400">{error}</p>}
        <div className="md:col-span-2">
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Publishing…' : 'Publish listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
