import { useEffect, useState } from 'react'
import * as _ from 'radash'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil,
  HiExternalLink,
  HiFlag,
  HiX,
  HiEye,
  HiTrash,
  HiMenuAlt2,
  HiPaperAirplane,
  HiOutlineExternalLink
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import { useAuth } from 'src/hooks/useAuth'
import ViewReportModal from 'src/components/admin/reports/ViewReportModal'

export default function AdminReportsScene() {
  const listReportsRequest = useFetch(api.reports.list)
  const dismissReportRequest = useFetch(api.reports.dismiss)
  const deleteListingRequest = useFetch(api.listings.delete)
  const auth = useAuth()
  const [viewingReport, setViewingReport] = useState<null | t.ListingReport>(null)
  const listReports = async () => {
    const { error } = await listReportsRequest.fetch(
      {},
      {
        token: auth.token!
      }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  const dismissReport = async (report: t.ListingReport) => {
    const { error } = await dismissReportRequest.fetch({ id: report.id }, {
      token: auth.token!
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  const quitViewingReport = () => {
    setViewingReport(null)
  }
  const viewReport = (report: t.ListingReport) => {
    setViewingReport(report)
  }
  const deleteListingForReport = async (report: t.ListingReport) => {
    const _delete = await deleteListingRequest.fetch({ id: report.listingId }, {
      token: auth.token!
    })
    if (_delete.error) {
      console.error(_delete.error)
      toaster.danger(_delete.error.details)
      return
    }
    const dismiss = await dismissReportRequest.fetch({ id: report.id }, {
      token: auth.token!
    })
    if (dismiss.error) {
      console.error(dismiss.error)
      toaster.danger(dismiss.error.details)
      return
    }
  }
  useEffect(() => {
    if (!auth.token) return
    listReports()
  }, [auth.token])
  return (
    <>
      {viewingReport && (
        <ViewReportModal
          open
          report={viewingReport}
          onClose={quitViewingReport}
        />
      )}
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          <div className="flex flex-row justify-between items-center p-10">
            <h1 className="font-black text-4xl">Listing Reports</h1>
            <div>
            </div>
          </div>
          <ReportsTable
            reports={listReportsRequest.data?.reports ?? []}
            loading={listReportsRequest.loading}
            onDismiss={dismissReport}
            onDelete={deleteListingForReport}
            onView={viewReport}
          />
        </div>
      </div>
    </>
  )
}

const ReportsTable = ({ 
  reports, 
  loading,
  onDismiss,
  onDelete,
  onEmail,
  onView
}: { 
  reports: t.ListingReport[]
  loading: boolean 
  onDismiss?: (report: t.ListingReport) => void
  onDelete?: (report: t.ListingReport) => void
  onEmail?: (report: t.ListingReport) => void
  onView?: (report: t.ListingReport) => void
}) => {
  const handleAllCheck = () => {}
  const dismissReport = (report: t.ListingReport) => () => {
    onDismiss?.(report)
  }
  const deleteListingForReport = (report: t.ListingReport) => () => {
    onDelete?.(report)
  }
  const emailUser = (report: t.ListingReport) => () => {
    onEmail?.(report)
  }
  const viewReport = (report: t.ListingReport) => () => {
    onView?.(report)
  }
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 py-4 pl-4 pr-2">
            <input type="checkbox" onChange={handleAllCheck} />
          </td>
          <td className="border-r border-slate-100 p-4 font-bold">Flags</td>
          <td className="border-r border-slate-100 p-4 font-bold">Listing</td>
          <td className="border-r border-slate-100 p-4 font-bold">User</td>
          <td className="border-r border-slate-100 p-4 font-bold">Email</td>
          <td className="border-r border-slate-100 p-4 font-bold">Comments</td>
          <td className="border-r border-slate-100 p-4 font-bold">Status</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {_.sort(reports, r => r.createdAt, true).map((report, idx) => (
          <>
            <tr key={report.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
              <td className="py-4 pl-4 pr-2 border-r border-slate-100">
                <input type="checkbox" />
              </td>
              <td className="p-4 border-r border-slate-100">
                <div className="flex items-center">
                  <span>{report.reports.length}</span>
                  <HiFlag className={report.status === 'dismissed' ? 'text-slate-400' : 'text-red-500'} />
                </div>
              </td>
              <td className="p-4 border-r border-slate-100">
                <div className="flex flex-row items-center">
                  <a href={`/listing/${report.listing.slug}`} target="_blank" className="flex flex-row group items-center">
                    <span className="group-hover:underline block mr-2">{report.listing.title}</span>
                    <HiOutlineExternalLink className="text-slate-800" />
                  </a>
                </div>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span className="block">{report.listing.user.fullName}</span>
              </td>
              <td className="p-4 border-r border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="block ml-4">{report.listing.user.email}</span>
                  <a href={`mailto:${report.listing.user.email}`}>
                    <button
                      className="rounded bg-slate-100 p-2 group hover:bg-black"
                    >
                      <HiPaperAirplane className="text-slate-500 group-hover:text-white" />
                    </button>
                  </a>
                </div>
              </td>
              <td className="p-4 border-r border-slate-100">
                <div className="flex items-center">
                  <span className="block grow">{report.reports[0].message}</span>
                  <button
                    className="rounded bg-slate-100 p-2 group hover:bg-black"
                    onClick={viewReport(report)}
                  >
                    <HiMenuAlt2 className="text-slate-500 group-hover:text-white" />
                  </button>
                </div>
              </td>
              <td className="p-4 border-r border-slate-100">
                <div className="">
                  {report.status === 'dismissed' && (
                    <div className="inline-block rounded-md uppercase text-slate-700 font-bold px-2 py-1">
                      <span className="text-sm">dismissed</span>
                    </div>
                  )}
                  {report.status === 'pending' && (
                    <div className="inline-block rounded-md uppercase text-red-600 font-bold px-2 py-1">
                      <span className="text-sm">pending</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="py-4 pl-4 pr-1">
                {report.status === 'pending' && (
                  <>
                    <button
                      className="rounded bg-slate-100 p-2 ml-2 group hover:bg-black"
                      onClick={dismissReport(report)}
                    >
                      <HiX className="text-slate-500 group-hover:text-white" />
                    </button>
                    <button
                      className="rounded bg-slate-100 p-2 ml-2 group hover:bg-red-600"
                      onClick={deleteListingForReport(report)}
                    >
                      <HiTrash className="text-slate-500 group-hover:text-white" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )
}
