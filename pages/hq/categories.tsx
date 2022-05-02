import type { NextPage } from 'next'
import Head from 'next/head'
import AdminAccountGuard from 'src/components/guards.tsx/AdminAccountGuard'
import AdminCategoriesScene from 'src/scenes/Admin/Categories'

const AdminCategoriesPage: NextPage = () => {
  return (
    <AdminAccountGuard>
      <AdminCategoriesScene />
    </AdminAccountGuard>
  )
}

export default AdminCategoriesPage
