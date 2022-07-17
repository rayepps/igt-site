import Link from 'next/link'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import { useFormation } from 'src/hooks/useFormation'
import * as yup from 'yup'
import { toaster } from 'evergreen-ui'
import { useRouter } from 'next/router'
import storage from 'src/local-storage'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import Heading from 'src/components/Heading'
import { HiHeart, HiOutlineExternalLink, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import GridGallery from 'src/components/GridGallery'
import { useEffect, useState } from 'react'
import Pill from 'src/components/Pill'
import { useAuth } from 'src/hooks/useAuth'
import differenceInDays from 'date-fns/differenceInDays'

export default function Account({}: {}) {
  const auth = useAuth()
  const getSelfRequest = useFetch(api.users.getSelf)
  const listListingsRequest = useFetch(api.listings.search)
  useEffect(() => {
    if (!auth.token || !auth.user) return
    getSelfRequest.fetch({}, { token: auth.token })
    listListingsRequest.fetch({ posterId: auth.user.id })
  }, [auth.token])
  const user = getSelfRequest.data?.user ?? null
  if (!user) return null
  const listings = listListingsRequest.data?.listings ?? []
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="min-w-[300px] mt-8">
          <div className="border border-slate-200 p-4">
            <h3 className="font-bold text-2xl mb-2">Account</h3>
            <div className="flex flex-row items-center mb-2">
              <strong className="mr-2">Name:</strong>
              <span>{user.fullName}</span>
            </div>
            <div className="flex flex-row items-center">
              <strong className="mr-2">Email:</strong>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
        <div className="pl-8 pt-8 grow">
          <h3 className="font-bold text-2xl mb-2">Your Listings</h3>
          <ListingsTable loading={listListingsRequest.loading} listings={listings} />
        </div>
      </div>
    </div>
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
  console.log(listings)
  const editListing = (listing: t.Listing) => () => {
    onEdit?.(listing)
  }
  const removeListing = (listing: t.Listing) => () => {
    onRemove?.(listing)
  }
  return (
    <table className="w-full">
      <thead className="border-b border-slate-100">
        <tr>
          <td className="border-r border-slate-100 p-4 font-bold">Title</td>
          <td className="border-r border-slate-100 p-4 font-bold">Price</td>
          <td className="border-r border-slate-100 p-4 font-bold">Status</td>
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
                <span className="group-hover:underline block mr-2">{listing.title}</span>
                <HiOutlineExternalLink className="text-slate-800" />
              </a>
            </td>
            <td className="p-4 border-r border-slate-100">
              <span>{listing.displayPrice}</span>
            </td>
            <td className="p-4 border-r border-slate-100">
              {listing.status === 'available' && (
                <span className="inline-block py-1 px-2 rounded bg-green-700 font-bold text-xs text-slate-100">
                  available
                </span>
              )}
              {listing.status === 'sold' && (
                <span className="inline-block py-1 px-2 rounded bg-red-700 font-bold text-xs text-slate-100">sold</span>
              )}
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
              <a href={`/listing/${listing.slug}/edit`}>
                <button className="rounded bg-slate-100 p-2 group hover:bg-black">
                  <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
                </button>
              </a>
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
