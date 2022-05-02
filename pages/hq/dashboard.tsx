import type { NextPage } from 'next'
import Head from 'next/head'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminDashboardScene from 'src/scenes/Admin/Dashboard'

const AdminLoginPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminDashboardScene />
    </AdminAccountGuard>
  )
}

export default AdminLoginPage
