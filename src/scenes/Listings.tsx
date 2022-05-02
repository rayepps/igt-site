import _ from 'radash'
import * as t from '../types'
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
          <Heading>Featured Listings</Heading>
          <ListingGrid listings={listings} />
          <div className="flex flex-row justify-center my-8">paginate me</div>
        </div>
        <div className="pt-8 max-w-sm w-full">
          <Heading>Browse Classifieds</Heading>
          <CategoryPanel categories={categories} />
          <Heading className="mt-4 mb-2">Our Sponsors</Heading>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}
