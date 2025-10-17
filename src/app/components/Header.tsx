"use client"
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="w-full border-b p-4 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))' }}>
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg" style={{ color: 'var(--accent)' }}>Gold Dashboard</Link>
        <nav className="hidden sm:flex gap-3 text-sm">
          <Link href="/">Overview</Link>
          {session?.user && <>
            <Link href="/strategy/example">Strategy</Link>
            {(session.user && (session.user as any).role === 'admin') && (
              <Link href="/admin/users/dashboard">User Management</Link>
            )}
          </>}
        </nav>
      </div>

      <div>
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm muted">{session.user.email}</span>
            <button onClick={() => signOut()} className="px-3 py-1 border rounded" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="px-3 py-1 border rounded" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>Sign in</button>
        )}
      </div>
    </header>
  )
}
