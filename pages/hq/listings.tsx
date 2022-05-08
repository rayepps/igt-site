import type { NextPage } from 'next'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminListingsScene from 'src/scenes/Admin/Listings'

const AdminListingsPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminListingsScene />
    </AdminAccountGuard>
  )
}

export default AdminListingsPage
