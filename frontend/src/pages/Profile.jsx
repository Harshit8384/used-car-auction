import { useEffect, useState } from 'react';
import { userService } from '../services/userService.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', phoneNumber: '', currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    userService.getProfile()
      .then((p) => {
        setProfile(p);
        setForm((f) => ({ ...f, name: p.name || '', phoneNumber: p.phoneNumber || '' }));
      })
      .catch((e) => setMsg({ type: 'err', text: e?.response?.data?.message || 'Failed to load profile.' }))
      .finally(() => setLoading(false));
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        phoneNumber: form.phoneNumber,
        ...(form.newPassword ? { currentPassword: form.currentPassword, newPassword: form.newPassword } : {}),
      };
      const updated = await userService.updateProfile(payload);
      setProfile(updated);
      setUser((u) => u ? { ...u, name: updated.name } : u);
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '' }));
      setMsg({ type: 'ok', text: 'Profile updated.' });
    } catch (err) {
      setMsg({ type: 'err', text: err?.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  };

  if (loading) return <p className="mx-auto max-w-3xl px-6 py-20 text-text-muted">Loading…</p>;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl font-extrabold">Your profile</h1>
      {profile && (
        <p className="mt-1 text-sm text-text-secondary">
          {profile.email} · <span className="text-accent">{profile.role}</span>
        </p>
      )}

      <form onSubmit={submit} className="card mt-8 space-y-4">
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label">Phone number</label>
          <input className="input" required value={form.phoneNumber} onChange={set('phoneNumber')} />
        </div>

        <div className="border-t border-bg-border pt-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">Change password (optional)</p>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label className="label">Current password</label>
              <input className="input" type="password" value={form.currentPassword} onChange={set('currentPassword')} />
            </div>
            <div>
              <label className="label">New password</label>
              <input className="input" type="password" value={form.newPassword} onChange={set('newPassword')} />
            </div>
          </div>
        </div>

        {msg.text && (
          <p className={`text-xs ${msg.type === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>
        )}
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
