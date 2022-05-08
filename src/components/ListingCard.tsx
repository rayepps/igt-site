import * as t from 'src/types'

export default function ListingCard({ listing }: { listing: t.Listing }) {
  if (!listing) return null
  const thumbnail = () => {
    if (!listing.images || listing.images.length === 0) return '/us-flag-rifle.jpeg'
    return listing.images[0].url
  }
  console.log(listing)
  return (
    <div className="border border-gray-200 p-2">
      <a href={`/listing/${listing.slug}`}>
        <div className="w-full h-56">
          <img src={thumbnail()} className="object-cover h-[200px] w-full" />
        </div>
      </a>
      <div className="flex flex-row items-start justify-between">
        <span className="">{listing.displayPrice}</span>
        {listing.status === 'sold' && (
          <span className="p-1 bg-red-600 uppercase text-white text-sm font-bold">sold</span>
        )}
      </div>
      <a className="text-sm" href={`/listing/${listing.slug}`}>
        {listing.title}
      </a>
      {listing.location && (
        <div>
          {listing.location.city}, {listing.location.state}
        </div>
      )}
    </div>
  )
}
