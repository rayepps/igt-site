import Link from 'next/link'
import * as t from 'src/types'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'
import Heading from 'src/components/Heading'

export default function LogoutScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  const auth = useAuth()
  useEffect(() => {
    auth.logout()
  }, [])
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <div className="max-w-md">
            <h1 className="text-4xl mb-4">Logout</h1>
            <p className="max-w-prose">You have been successfully logged out.</p>
          </div>
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
