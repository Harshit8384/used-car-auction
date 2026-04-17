import { useState } from 'react';
import { bidService } from '../services/bidService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/format.js';

export default function BidForm({ car, minBid, onPlaced }) {
  const { user } = useAuth();
  const [amount, setAmount] = useState(minBid);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="card text-center">
        <p className="text-sm text-text-secondary">Sign in to place a bid.</p>
        <Link to="/login" className="btn-primary mt-4 w-full">Login to bid</Link>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    const value = Number(amount);
    if (!value || value < minBid) {
      setError(`Bid must be at least ${formatINR(minBid)}`);
      return;
    }
    setLoading(true);
    try {
      await bidService.place(car.id, value);
      onPlaced?.();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to place bid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="card">
      <h3 className="font-display text-lg font-bold">Place your bid</h3>
      <p className="mt-1 text-xs text-text-muted">Minimum bid: {formatINR(minBid)}</p>

      <label className="label mt-4" htmlFor="amount">Your bid (INR)</label>
      <input
        id="amount"
        type="number"
        min={minBid}
        step={1000}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input"
      />

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary mt-4 w-full">
        {loading ? 'Placing bid…' : `Bid ${formatINR(Number(amount) || minBid)}`}
      </button>
    </form>
  );
}
