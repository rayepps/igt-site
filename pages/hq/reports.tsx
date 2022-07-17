import type { NextPage } from 'next'
import Head from 'next/head'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminReportsScene from 'src/scenes/Admin/Reports'

const AdminReportsPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminReportsScene />
    </AdminAccountGuard>
  )
}

export default AdminReportsPage
