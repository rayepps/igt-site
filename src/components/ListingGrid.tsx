import * as _ from 'radash'
import { ReactNode } from 'react'
import * as t from 'src/types'
import ListingCard from './ListingCard'
import Skeleton from 'react-loading-skeleton'

export default function ListingGrid({
  listings,
  loading = false,
  fallback = null
}: {
  listings: t.Listing[]
  fallback?: ReactNode | null
  loading?: boolean
}) {
  if (!loading && listings.length === 0) {
    return <>{fallback}</>
  }
  return (
    <div
      className="grow grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6"
    >
      {!loading && listings.map((lst) => (
        <ListingCard key={lst.id} listing={lst} />
      ))}
      {loading && [0, 1, 2, 3, 4].map((i) => (
        <div key={i}>
          <div className="pb-2">
            <Skeleton
              width='100%'
              height={170}
            />
          </div>
          <div className="pb-2">
            <Skeleton
              width='40%'
              height={24}
            />
          </div>
          <div>
            <Skeleton
              width='67%'
              height={24}
            />
          </div>
        </div>
      ))}
    </div>
  )
}