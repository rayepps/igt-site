import _ from 'radash'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import HorizontalGallery from 'src/components/HorizontalGallery'
import { useAuth } from 'src/hooks/useAuth'
import EditSponsorModal from 'src/components/admin/sponsor/EditSponsorModal'
import CreateSponsorModal from 'src/components/admin/sponsor/CreateSponsorModal'

export default function AdminSponsorsScene() {
  const listSponsorsRequest = useFetch(api.sponsors.list)
  const listCategoriesRequest = useFetch(api.categories.list)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<null | t.Sponsor>(null)
  useEffect(() => {
    listCategoriesRequest.fetch({}, { token: auth.refresh()! })
  }, [])
  const listSponsors = async () => {
    const { error } = await listSponsorsRequest.fetch(
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
  const addSponsor = () => {
    setAddModalOpen(true)
  }
  const quitEditingSponsor = () => {
    setEditingSponsor(null)
  }
  const quitCreatingSponsor = () => {
    setAddModalOpen(false)
  }
  const startEditingSponsor = (cat: t.Sponsor) => {
    setEditingSponsor(cat)
  }
  useEffect(() => {
    if (!auth.token) return
    listSponsors()
  }, [auth.token])
  return (
    <>
      {editingSponsor && (
        <EditSponsorModal
          open
          categories={listCategoriesRequest.data?.categories ?? []}
          sponsor={editingSponsor}
          onClose={quitEditingSponsor}
          onCancel={quitEditingSponsor}
          onComplete={quitEditingSponsor}
        />
      )}
      <CreateSponsorModal
        open={addModalOpen}
        onCancel={quitCreatingSponsor}
        onClose={quitCreatingSponsor}
        onComplete={quitCreatingSponsor}
      />
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          <div className="flex flex-row justify-between items-center p-10">
            <h1 className="font-black text-4xl">Sponsors</h1>
            <div>
              <button className="bg-red-500 rounded px-2 py-1 text-white font-bold" onClick={addSponsor}>
                Add
              </button>
            </div>
          </div>
          <SponsorsTable
            sponsors={listSponsorsRequest.data?.sponsors ?? []}
            loading={listSponsorsRequest.loading}
            onEdit={startEditingSponsor}
          />
        </div>
      </div>
    </>
  )
}

const SponsorsTable = ({ 
  sponsors, 
  loading,
  onEdit
}: { 
  sponsors: t.Sponsor[]
  loading: boolean 
  onEdit?: (cat: t.Sponsor) => void
}) => {
  const handleAllCheck = () => {}
  const handleCheck = (sponsor: t.Sponsor) => () => {}
  const editSponsor = (sponsor: t.Sponsor) => () => {
    onEdit?.(sponsor)
  }
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 py-4 pl-4 pr-2">
            <input type="checkbox" onChange={handleAllCheck} />
          </td>
          <td className="border-r border-slate-100 p-4 font-bold">Name</td>
          <td className="border-r border-slate-100 p-4 font-bold">Status</td>
          <td className="border-r border-slate-100 p-4 font-bold">Tier</td>
          <td className="border-r border-slate-100 p-4 font-bold">Categories</td>
          <td className="border-r border-slate-100 p-4 font-bold">Campaigns</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {sponsors.map((sponsor, idx) => (
          <>
            <tr key={sponsor.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
              <td className="py-4 pl-4 pr-2 border-r border-slate-100">
                <input type="checkbox" />
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/sponsors/${sponsor.id}`} passHref>
                  <a className="hover:underline">{sponsor.name}</a>
                </Link>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>{_.camalCase(sponsor.status)}</span>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>{_.camalCase(sponsor.tier)}</span>
              </td>
              <td className="p-4 border-r border-slate-100">
                {sponsor.categories.map((cat) => (
                  <span key={cat.id}>{cat.label}</span>
                ))}
              </td>
              <td className="p-4 border-r border-slate-100">
                {sponsor.campaigns.map((camp) => (
                  <span>{camp.name}</span>
                ))}
              </td>
              <td className="py-4 pl-4 pr-1">
                <button className="rounded bg-slate-100 p-2 group hover:bg-black" onClick={editSponsor(sponsor)}>
                  <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
                </button>
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )
}
