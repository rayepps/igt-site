import * as _ from 'radash'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HiOutlineExternalLink, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import { useAuth } from 'src/hooks/useAuth'
import EditSponsorModal from 'src/components/admin/sponsor/EditSponsorModal'
import CreateSponsorModal from 'src/components/admin/sponsor/CreateSponsorModal'
import RemoveSponsorModal from 'src/components/admin/sponsor/RemoveSponsorModal'
import differenceInDays from 'date-fns/differenceInDays'

export default function AdminListingsPage() {
  const searchListingsRequest = useFetch(api.listings.search)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingListing, setEditingListing] = useState<null | t.Listing>(null)
  const [removingListing, setRemovingListing] = useState<null | t.Listing>(null)
  const listListings = async () => {
    const { error } = await searchListingsRequest.fetch(
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
    setEditingListing(null)
  }
  const quitCreatingSponsor = () => {
    setAddModalOpen(false)
  }
  const startEditingSponsor = (s: t.Listing) => {
    setEditingListing(s)
  }
  const startRemovingSponsor = (s: t.Listing) => {
    setRemovingListing(s)
  }
  useEffect(() => {
    if (!auth.token) return
    listListings()
  }, [auth.token])
  return (
    <>
      {/* {editingListing && (
        <EditSponsorModal
          open
          categories={listCategoriesRequest.data?.categories ?? []}
          sponsor={editingListing}
          onClose={quitEditingSponsor}
          onCancel={quitEditingSponsor}
          onComplete={_.chain(quitEditingSponsor, listListings)}
        />
      )}
      {removingListing && (
        <RemoveSponsorModal
          open
          sponsor={removingListing}
          onClose={_.partial(setRemovingListing, false)}
          onCancel={_.partial(setRemovingListing, false)}
          onComplete={_.chain(_.partial(setRemovingListing, false), listListings)}
        />
      )} */}
      <CreateSponsorModal
        open={addModalOpen}
        onCancel={quitCreatingSponsor}
        onClose={quitCreatingSponsor}
        onComplete={_.chain(quitCreatingSponsor, listListings)}
      />
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          <div className="flex flex-row justify-between items-center p-10">
            <h1 className="font-black text-4xl">Listings</h1>
            <div>
              <button className="bg-red-500 rounded px-2 py-1 text-white font-bold" onClick={addSponsor}>
                Add
              </button>
            </div>
          </div>
          <ListingsTable
            listings={searchListingsRequest.data?.listings ?? []}
            loading={searchListingsRequest.loading}
            onEdit={startEditingSponsor}
            onRemove={startRemovingSponsor}
          />
        </div>
      </div>
    </>
  )
}

const ListingsTable = ({
  listings,
  loading,
  onEdit,
  onRemove
}: {
  listings: t.Listing[]
  loading: boolean
  onEdit?: (s: t.Listing) => void
  onRemove?: (s: t.Listing) => void
}) => {
  const editListing = (sponsor: t.Listing) => () => {
    onEdit?.(sponsor)
  }
  const removeListing = (sponsor: t.Listing) => () => {
    onRemove?.(sponsor)
  }
  return (
    <table className="w-full">
      <thead className="border-b border-slate-100">
        <tr>
          <td className="border-r border-slate-100 p-4 font-bold">Title</td>
          <td className="border-r border-slate-100 p-4 font-bold">Author</td>
          <td className="border-r border-slate-100 p-4 font-bold">Price</td>
          <td className="border-r border-slate-100 p-4 font-bold">Category</td>
          <td className="border-r border-slate-100 p-4 font-bold">Expires</td>
          <td></td>
        </tr>
      </thead>
      <tbody className="border-x border-slate-100">
        {listings.map((listing, idx) => (
          <tr key={listing.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
            <td className="p-4 border-r border-slate-100">
              <a href={`/listing/${listing.slug}`} target="_blank" className="flex flex-row group items-center">
                <span className="group-hover:underline">{listing.title}</span>
                <HiOutlineExternalLink className="text-slate-800" />
              </a>
            </td>
            <td className="p-4 border-r border-slate-100">
              <Link href={`/hq/users/${listing.user.id}`} passHref>
                <a className="hover:underline">{listing.user.fullName}</a>
              </Link>
            </td>
            <td className="p-4 border-r border-slate-100">
              <span>{listing.displayPrice}</span>
            </td>
            <td className="p-4 border-r border-slate-100">
              <span className="inline-block py-1 px-2 rounded bg-slate-800 font-bold text-xs text-slate-100">
                {listing.category.label}
              </span>
            </td>
            <td className="p-4 border-r border-slate-100">
              <span>{differenceInDays(new Date(listing.expiresAt), new Date())} days</span>
            </td>
            <td className="py-4 pl-4 pr-1">
              <button className="rounded bg-slate-100 p-2 group hover:bg-black" onClick={editListing(listing)}>
                <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
              </button>
              <button className="ml-2 rounded bg-slate-100 p-2 group hover:bg-red-600" onClick={removeListing(listing)}>
                <HiOutlineTrash className="text-slate-500 group-hover:text-white" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
