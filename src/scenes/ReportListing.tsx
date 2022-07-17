import * as _ from 'radash'
import * as t from '../types'
import ListingGrid from 'src/components/ListingGrid'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import Heading from 'src/components/Heading'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import { useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { toaster } from 'evergreen-ui'
import { useRouter } from 'next/router'

export default function ReportListingsScene({
  listing,
  categories,
  sponsors
}: {
  listing: t.Listing
  categories: t.Category[]
  sponsors: t.Sponsor[]
}) {
  const submitReport = useFetch(api.reports.submit)
  const router = useRouter()
  const auth = useAuth()
  const submit = async ({ message }: { message: string }) => {
    const response = await submitReport.fetch({ listingId: listing.id, message }, {
      token: auth.refresh()?.idToken
    })
    if (response.error) {
      console.error(response.error)
      toaster.danger(`Failed to report: ${response.error.details}`)
      return
    }
    toaster.success('Successfully reported listing')
    router.back()
  }
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <h1 className="text-3xl font-bold">Report Listing</h1>
          <ReportForm listing={listing} onSubmit={submit} />
        </div>
        <div className="min-w-[300px]">
          <Heading>Browse Classified</Heading>
          <CategoryPanel categories={categories} />
          <Heading>Our Sponsors</Heading>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}

const ReportForm = ({ 
  listing,
  onSubmit
}: { 
  listing: t.Listing
  onSubmit?: ({ message }: { message: string }) => void
}) => {
  const [message, setMessage] = useState('')
  return (
    <div className="">
      <div>
        <span className="text-xl font-bold">{listing.title}</span>
      </div>
      <div className="my-4">
        <div>
          <label>Tell us more</label>
        </div>
        <textarea 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          placeholder="Why do you want to flag this listing?"
          className="p-2"
        />
      </div>
      <div>
        <button
          className="w-full bg-red-600 text-white py-2"
          disabled={!message}
          onClick={() => onSubmit?.({ message })}
        >
          Report
        </button>
      </div>
    </div>
  )
}