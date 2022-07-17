import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiFlag
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { useAuth } from 'src/hooks/useAuth'

export default function AdminDashboardScene() {
  const listReports = useFetch(api.reports.list)
  const auth = useAuth()
  useEffect(() => {
    listReports.fetch({}, { token: auth.refresh()?.idToken })
  }, [])
  return (
    <div className="flex flex-row">
      <AdminSidebar />
      <div className="grow p-2">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <ListingReportsPanel 
          reports={listReports.data?.reports ?? []} 
          loading={listReports.loading} 
        />
      </div>
    </div>
  )
}

export const ListingReportsPanel = ({
  reports,
  loading
}: {
  loading: boolean
  reports: t.ListingReport[]
}) => {

  const getListing = (report: t.ListingReport): t.Listing => {
    return report.reports[0].snapshot
  }

  const pending = reports.filter(r => r.status === 'pending')

  return (
    <div className="p-4 border border-slate-300 rounded-lg max-w-[40%]">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-xl font-bold">Reported Listings</h3>
        <div>
          <Link passHref href="/hq/reports">
            <a className="text-sm text-red-600 font-bold hover:underline">view all</a>
          </Link>
        </div>
      </div>
      {pending.length === 0 && (
        <div className="h-[80px] flex flex-col items-center justify-center">
          <span>No pending reports</span>
        </div>
      )}
      {pending.length > 0 && (
        <table>
          <tbody className="w-full">
            {pending.map(report => (
              <tr key={report.id}>
                <td className="p-2">
                  <div>
                    <span>{getListing(report).title}</span>
                  </div>
                </td>
                <td className="p-2">
                  <div className="flex items-center">
                    <span>{report.reports.length}</span>
                    <HiFlag color="red" />
                  </div>
                </td>
                <td className="p-2">
                  <div>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}