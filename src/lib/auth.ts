import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { getDb } from './mongodb'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // On sign in, create or check the users collection and redirect pending users
    async signIn({ user, account }: any) {
      try {
        const db = await getDb()
        const coll = db.collection('users')
        const providerId = account?.providerAccountId || user.id
        const existing = await coll.findOne({ provider_id: String(providerId) })
        if (!existing) {
          const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim()).filter(Boolean)
          const role = adminEmails.includes(user.email) ? 'admin' : 'user'
          const approved = role === 'admin'
          await coll.insertOne({
            email: user.email,
            name: user.name,
            provider: account.provider,
            provider_id: String(providerId),
            role,
            approved,
            requested_at: new Date(),
            approved_at: approved ? new Date() : null
          })
          if (!approved) return '/auth/pending'
        } else {
          if (!existing.approved) return '/auth/pending'
        }
      } catch (e) {
        console.error('signIn error', e)
        return false
      }
      return true
    },

    // Include role and approved on the session.user object
    async session({ session }: any) {
      try {
        // Force admin for specific email
        if (session.user?.email === 'mouhib.otm@gmail.com') {
          session.user = session.user || {}
          ;(session.user as any).role = 'admin'
          ;(session.user as any).approved = true
          return session
        }
        const db = await getDb()
        const coll = db.collection('users')
        const u = await coll.findOne({ email: session.user?.email })
        if (u) {
          session.user = session.user || {}
          ;(session.user as any).role = u.role
          ;(session.user as any).approved = !!u.approved
        }
      } catch (e) {
        console.error('session callback error', e)
      }
      return session
    }
  }
}

export default NextAuth(authOptions)
