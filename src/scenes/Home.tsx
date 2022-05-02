import _ from 'radash'
import { useState } from 'react'
import Link from 'next/link'
import { HiOutlineLocationMarker, HiArrowNarrowRight } from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from '../types'
import { useRouter } from 'next/router'
import useAnalytics from 'src/hooks/useAnalytics'
import { toaster } from 'evergreen-ui'
import ListingGrid from 'src/components/ListingGrid'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import Heading from 'src/components/Heading'

export default function HomeScene({
  listings,
  categories,
  sponsors
}: {
  listings: t.Listing[]
  categories: t.Category[]
  sponsors: t.Sponsor[]
}) {
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="py-8 mr-8">
          <Hero />
          <Heading>Featured Listings</Heading>
          <ListingGrid listings={listings} />
          <div className="flex flex-row justify-center my-8">
            <a href="/listings" className="px-8 py-2 text-white bg-red-600 hover:bg-red-500">
              More Listings
            </a>
          </div>
        </div>
        <div className="pt-8 max-w-sm w-full">
          <Heading>Browse Classifieds</Heading>
          <CategoryPanel categories={categories} />
          <div className="p-2 mt-4 text-black bg-gray-100 uppercase text-2xl mb-2">
            <h2>Our Sponsors</h2>
          </div>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}

const Hero = () => {
  return (
    <div>
      <img src="/us-flag-rifle.jpeg" className="w-full h-auto" />
      <div className="mt-8">
        <h3 className="uppercase text-2xl mb-4 font-semibold">
          ZERO FEES, UNLIMITED LISTINGS, &amp; WE SUPPORT OUR IDAHO VETERANS!
        </h3>
        <div className="mb-2">
          <p>
            <span className="text-red-600 font-bold uppercase">SCAMS:</span> There is one simple rule to avoid getting
            ripped off. Don't send anyone a penny unless you meet face-to-face. Want to have it shipped? Use FFL Dealers
            like{' '}
            <a href="https://burningbullet.com/" className="text-blue-500 hover:underline">
              Burning Bullet
            </a>{' '}
            to help with logistics.
          </p>
        </div>
        <div className="mb-2">
          <p>
            <span className="text-red-600 font-bold uppercase">AREA CODES:</span> If you don't have a 208 area code, we
            suggest you mention details regarding your location. This will help members trust you're not from out of
            state or a scammer.
          </p>
        </div>
        <div className="mb-2">
          <p>
            <span className="text-red-600 font-bold uppercase">SOLD:</span> Please remember to mark your listings sold
            as we are getting very busy.
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-center items-center my-8">
        <img src="/tiny-pistol.jpeg" className="w-6 h-auto" />
        <a
          className="text-blue-500 hover:underline mx-2"
          target="_blank"
          href="https://www.idahoguntrader.store/firearm-bill-of-sale"
        >
          Idaho Firearms Bill of Sale
        </a>
        <img src="/tiny-pistol.jpeg" className="w-6 h-auto" />
      </div>
    </div>
  )
}
