import { isAdmin } from '@/lib/auth'
import AdminCommunityModeration from '@/components/admin/AdminCommunityModeration'

export default function AdminPage() {
  if (!isAdmin) {
    return (
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto text-center">
        <h1 className="font-headline text-4xl md:text-5xl italic mb-6 text-primary">Access Denied</h1>
        <p className="text-on-surface-variant text-lg max-w-lg mx-auto">You do not have permission to access the admin panel.</p>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h1 className="font-headline text-4xl md:text-5xl italic mb-12 text-primary">Admin Dashboard</h1>
      <AdminCommunityModeration />
    </main>
  )
}
