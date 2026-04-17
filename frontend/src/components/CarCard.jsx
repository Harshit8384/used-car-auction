import { Link } from 'react-router-dom';
import { formatINR, timeLeft } from '../utils/format.js';

export default function CarCard({ car }) {
  const left = timeLeft(car.auctionEndTime);
  const ended = left === 'Ended';

  return (
    <Link
      to={`/cars/${car.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-bg-border bg-bg-surface transition hover:border-accent/60 hover:shadow-glow"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bg-elevated">
        {car.imageUrl ? (
          <img
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-text-muted text-sm">No image</div>
        )}
        <span className={`badge absolute left-3 top-3 ${ended ? 'border-bg-border bg-bg-base/80 text-text-muted' : 'border-accent/40 bg-bg-base/80 text-accent'}`}>
          {ended ? 'Ended' : left}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg font-bold leading-tight">
              {car.make} {car.model}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">
              {car.year} · {car.fuelType} · {car.transmission}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-text-muted">Current bid</p>
            <p className="font-display text-xl font-bold text-accent">{formatINR(car.currentPrice ?? car.startingPrice)}</p>
          </div>
          <span className="text-xs text-text-secondary">{(car.mileage ?? 0).toLocaleString()} km</span>
        </div>
      </div>
    </Link>
  );
}
