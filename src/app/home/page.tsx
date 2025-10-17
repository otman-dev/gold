"use client"
export default function Home() {
  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--accent)' }}>Welcome to Gold Trading Dashboard</h1>
      <p className="text-lg mb-6">Sign in with Google to access your trading dashboard. If your account is pending, you will be notified after sign in.</p>
      <button className="btn btn-primary" onClick={() => window.location.href = '/api/auth/signin'}>Sign in with Google</button>
    </div>
  )
}
