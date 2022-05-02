import { useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'

export default function AdminDashboardScene() {
  return (
    <div className="flex flex-row">
      <AdminSidebar />
      <div className="grow">
        this is content
      </div>
    </div>
  )
}
