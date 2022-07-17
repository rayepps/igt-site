import * as _ from 'radash'
import * as t from '../types'
import ListingGrid from 'src/components/ListingGrid'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import Heading from 'src/components/Heading'
import { useRouter } from 'next/router'

const list = (start: number, end: number, step: number = 1): number[] => {
  let array: number[] = []
  for (const item of _.range(start, end, step) as any) array.push(item)
  return array
}

const Pagination = ({
  total,
  page,
  size,
  onClick
}: {
  total: number
  page: number
  size: number
  onClick?: (page: number) => void
}) => {
  const pages = Math.ceil(total / size)
  const pageNumbers = (() => {
    if (total <= size) return [1]
    if (pages < 6) return list(1, _.min([pages, 6]))
    if (pages - page <= 3) return list(_.max([1, pages - 3]), pages)
    return list(pages - 3, pages + 3)
  })()
  console.log(pageNumbers)
  return (
    <div className="">
      {pageNumbers.map(idx => (
        <button 
          key={idx} 
          onClick={() => onClick?.(idx)}
          disabled={idx === page}
          className={`p-2 hover:bg-red-500 hover:text-white ${idx === page ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-900'}`}
        >
          {`${idx}`}
        </button>
      ))}
    </div>
  )
}

export default function ListingsScene({
  listings,
  categories,
  sponsors,
  args,
  total,
  page,
  size
}: {
  listings: t.Listing[]
  categories: t.Category[]
  sponsors: t.Sponsor[]
  args: Record<string, string>
  total: number
  page: number
  size: number
}) {
  const router = useRouter()
  const gotoPage = (newPage: number) => {
    const query = _.shake(args, x => x !== undefined && !!x.trim())
    const qs = new URLSearchParams({
      ...query,
      page: `${newPage}`,
      size: '25'
    }).toString()
    router.push(`/listings?${qs}`)
  }
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="py-8 mr-8">
          <Heading>Featured Listings</Heading>
          <ListingGrid listings={listings} />
          <div className="flex flex-row justify-center my-8">
            <Pagination 
              total={total} 
              page={page} 
              size={size} 
              onClick={gotoPage}
            />
          </div>
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
