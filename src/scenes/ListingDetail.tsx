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
import { HiHeart } from 'react-icons/hi'
import GridGallery from 'src/components/GridGallery'
import { useState } from 'react'
import Pill from 'src/components/Pill'

export default function ListingDetail({
  categories,
  sponsors,
  listing
}: {
  categories: t.Category[]
  sponsors: t.Sponsor[]
  listing: t.Listing
}) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <ListingInfo listing={listing} />
        </div>
        <div className="min-w-[300px] mt-8">
          <Heading>Browse Classified</Heading>
          <CategoryPanel categories={categories} />
          <Heading className="mt-8">Our Sponsors</Heading>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}

const ListingInfo = ({ listing }: { listing: t.Listing }) => {
  console.log(listing)
  const [image, setImage] = useState(listing.images[0] ?? null)
  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex flex-row items-center">
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          {listing.status === 'sold' && (
            <span className="ml-4 uppercase text-sm p-1 bg-red-600 font-bold text-white">sold</span>
          )}
        </div>
        <div>
          <HiHeart size={32} />
        </div>
      </div>
      <GridGallery images={listing.images} current={image} onImageClick={setImage} />
      <div className="py-8 border-y border-slate-200 my-8">
        <div>
          <span className="font-bold iline-block mr-2">Location:</span><span>{listing.location.city}, {listing.location.state}</span>
        </div>
        <div>
          <span className="font-bold iline-block mr-2">Price:</span><span>{listing.displayPrice}</span>
        </div>
        <div>
          <span className="font-bold iline-block mr-2">Category:</span><span>{listing.category.label}</span>
        </div>
      </div>
      <Heading>Description</Heading>
      <div><p className="max-w-prose">{listing.description}</p></div>
    </div>
  )
}
