"use client"
import { useEffect, useState } from "react"

export default function AdminUserDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/users/all")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {loading ? (
        <div className="muted">Loading users...</div>
      ) : (
        <table className="w-full text-sm card">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={String(u._id)} className="border-b">
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>
                  {u.approved ? (
                    <span className="text-green-500">Approved</span>
                  ) : (
                    <span className="text-yellow-500">Pending</span>
                  )}
                </td>
                <td>
                  {!u.approved && (
                    <button className="btn btn-primary mr-2" onClick={async () => {
                      await fetch("/api/admin/users/approve", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_id: u._id })
                      })
                      setUsers((users) => users.map((user) => user._id === u._id ? { ...user, approved: true } : user))
                    }}>
                      Approve
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={async () => {
                    await fetch("/api/admin/users/decline", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ user_id: u._id })
                    })
                    setUsers((users) => users.filter((user) => user._id !== u._id))
                  }}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
