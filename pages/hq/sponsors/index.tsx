import type { NextPage } from 'next'
import Head from 'next/head'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminSponsorsScene from 'src/scenes/Admin/Sponsors'

const AdminSponsorsPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminSponsorsScene />
    </AdminAccountGuard>
  )
}

export default AdminSponsorsPage
