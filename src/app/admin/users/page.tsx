"use client"
import { useEffect, useState } from 'react'

export default function AdminUsers() {
  const [pending, setPending] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/users/pending').then((r) => {
      if (r.ok) return r.json()
      return []
    }).then(setPending).catch(console.error)
  }, [])


  async function approve(id: string) {
    await fetch('/api/admin/users/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: id }) })
    setPending((p) => p.filter((u) => String(u._id) !== String(id)))
  }

  async function decline(id: string) {
    await fetch('/api/admin/users/decline', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: id }) })
    setPending((p) => p.filter((u) => String(u._id) !== String(id)))
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Pending Users</h1>
      <ul>
        {pending.map((u) => (
          <li key={String(u._id)} className="mb-2 flex items-center justify-between card-compact">
            <span>{u.email} - {u.name}</span>
            <span className="flex gap-2">
              <button className="btn btn-primary" onClick={() => approve(String(u._id))}>Approve</button>
              <button className="btn btn-ghost" onClick={() => decline(String(u._id))}>Decline</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
