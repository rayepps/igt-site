import type { NextPage } from 'next'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminAccountsScene from 'src/scenes/Admin/Accounts'

const AdminAccountsPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminAccountsScene />
    </AdminAccountGuard>
  )
}

export default AdminAccountsPage
