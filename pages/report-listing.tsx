import type { GetServerSidePropsResult, NextPage, NextPageContext } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import ReportListingScene from 'src/scenes/ReportListing'
import * as t from 'src/types'
import api from 'src/api'

export async function getServerSideProps(context: NextPageContext): Promise<GetServerSidePropsResult<Props>> {
  const listingId = context.query.listingId as string
  if (!listingId) {
    throw 'Listing id is required'
  }
  const listing = await api.listings.findById({
    id: listingId
  })
  if (listing.error) {
    console.error(listing.error)
    // TODO: Retry
  }
  const categories = await api.categories.list({})
  if (categories.error) {
    console.error(categories.error)
    // TODO: Retry
  }
  const sponsors = await api.sponsors.list({})
  if (sponsors.error) {
    console.error(sponsors.error)
    // TODO: Retry
  }
  return {
    props: {
      categories: categories.data?.categories ?? [],
      sponsors: sponsors.data?.sponsors ?? [],
      listing: listing.data.listing
    }
  }
}

type Props = {
  categories: t.Category[]
  sponsors: t.Sponsor[]
  listing: t.Listing
}

const ReportListingPage: NextPage<Props> = ({ listing, categories, sponsors }) => {
  return (
    <>
      <Header />
      <ReportListingScene listing={listing} categories={categories} sponsors={sponsors} />
      <Footer />
    </>
  )
}

export default ReportListingPage

