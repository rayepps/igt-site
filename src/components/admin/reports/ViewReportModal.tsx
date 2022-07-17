import { toaster } from 'evergreen-ui'
import { ChangeEventHandler, SyntheticEvent } from 'react'
import api from 'src/api'
import Modal from 'src/components/Modal'
import { useFetch } from 'src/hooks'
import { useFormation } from 'src/hooks/useFormation'
import * as t from 'src/types'
import * as yup from 'yup'
import slugger from 'url-slug'
import { useAuth } from 'src/hooks/useAuth'
import { HiUserCircle, HiX } from 'react-icons/hi'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function ViewReportModal({
  open = false,
  report,
  onClose
}: {
  open?: boolean
  report: t.ListingReport
  onClose?: () => void
}) {
  const listing = report.reports[0].snapshot
  return (
    <Modal open={open} onClose={onClose}>
      <div>
        <div className="flex flex-row justify-between items-center mb-4">
          <h4 className="font-bold text-xl">{listing.title}</h4>
          <button
            className="p-2"
            onClick={onClose}
          >
            <HiX className="text-slate-900" />
          </button>
        </div>
        <div>
          {report.reports.map(r => (
            <div className="p-4 border rounded-md border-slate-200">
              <div className="flex flex-row items-center">
                <HiUserCircle className="mr-2" />
                <span>
                  {r.anonymous ? 'Anonymous' : r.user?.fullName}
                </span>
              </div>
              <div>
                <span className="text-sm text-slate-500">
                  {formatDistanceToNow(r.timestamp)}
                </span>
              </div>
              <div>
                <p>{r.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}
