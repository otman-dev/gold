export default function Pending() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="card max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-2">
            <circle cx="24" cy="24" r="22" fill="var(--glass)" stroke="var(--accent)" strokeWidth="2" />
            <path d="M24 14v10" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="24" cy="32" r="2" fill="var(--accent)" />
          </svg>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>Pending Approval</h1>
        </div>
        <p className="muted mb-2">Your account is awaiting admin approval.</p>
        <p className="muted">You will be notified once an admin approves your account.<br />Thank you for your patience.</p>
      </div>
    </div>
  )
}
