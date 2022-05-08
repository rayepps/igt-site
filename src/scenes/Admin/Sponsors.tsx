import _ from 'radash'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HiOutlinePencil,
  HiOutlineTrash
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import { useAuth } from 'src/hooks/useAuth'
import EditSponsorModal from 'src/components/admin/sponsor/EditSponsorModal'
import CreateSponsorModal from 'src/components/admin/sponsor/CreateSponsorModal'
import RemoveSponsorModal from 'src/components/admin/sponsor/RemoveSponsorModal'

export default function AdminSponsorsScene() {
  const listSponsorsRequest = useFetch(api.sponsors.list)
  const listCategoriesRequest = useFetch(api.categories.list)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState<null | t.Sponsor>(null)
  const [removingSponsor, setRemovingSponsor] = useState<null | t.Sponsor>(null)
  useEffect(() => {
    listCategoriesRequest.fetch({}, { token: auth.refresh()?.idToken! })
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
  const startEditingSponsor = (s: t.Sponsor) => {
    setEditingSponsor(s)
  }
  const startRemovingSponsor = (s: t.Sponsor) => {
    setRemovingSponsor(s)
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
          onComplete={_.chain(quitEditingSponsor, listSponsors)}
        />
      )}
      {removingSponsor && (
        <RemoveSponsorModal
          open
          sponsor={removingSponsor}
          onClose={_.partial(setRemovingSponsor, false)}
          onCancel={_.partial(setRemovingSponsor, false)}
          onComplete={_.chain(_.partial(setRemovingSponsor, false), listSponsors)}
        />
      )}
      <CreateSponsorModal
        open={addModalOpen}
        onCancel={quitCreatingSponsor}
        onClose={quitCreatingSponsor}
        onComplete={_.chain(quitCreatingSponsor, listSponsors)}
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
            onRemove={startRemovingSponsor}
          />
        </div>
      </div>
    </>
  )
}

const SponsorsTable = ({
  sponsors,
  loading,
  onEdit,
  onRemove
}: {
  sponsors: t.Sponsor[]
  loading: boolean
  onEdit?: (s: t.Sponsor) => void,
  onRemove?: (s: t.Sponsor) => void
}) => {
  const editSponsor = (sponsor: t.Sponsor) => () => {
    onEdit?.(sponsor)
  }
  const removeSponsor = (sponsor: t.Sponsor) => () => {
    onRemove?.(sponsor)
  }
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 p-4 font-bold">Name</td>
          <td className="border-r border-slate-100 p-4 font-bold">Status</td>
          <td className="border-r border-slate-100 p-4 font-bold">Tier</td>
          <td className="border-r border-slate-100 p-4 font-bold">Categories</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {sponsors.map((sponsor, idx) => (
          <tr key={sponsor.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
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
              {sponsor.categories.map(cat => (
                <span key={cat.id}>{cat.label}</span>
              ))}
            </td>
            <td className="py-4 pl-4 pr-1">
              <button className="rounded bg-slate-100 p-2 group hover:bg-black" onClick={editSponsor(sponsor)}>
                <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
              </button>
              <button className="ml-2 rounded bg-slate-100 p-2 group hover:bg-red-600" onClick={removeSponsor(sponsor)}>
                <HiOutlineTrash className="text-slate-500 group-hover:text-white" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
