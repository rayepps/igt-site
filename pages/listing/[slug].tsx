import type { GetServerSideProps, GetServerSidePropsResult, NextPage, NextPageContext } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import ListingDetailScene from 'src/scenes/ListingDetail'
import * as t from 'src/types'
import api from 'src/api'

export const getServerSideProps: GetServerSideProps<Props> = async context => {
  const slug = (context.params?.['slug'] as string) ?? ''
  const listing = await api.listings.findBySlug({ slug })
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

const ListingDetailPage: NextPage<Props> = ({ categories, sponsors, listing }) => {
  return (
    <>
      <Header />
      <ListingDetailScene categories={categories} sponsors={sponsors} listing={listing} />
      <Footer />
    </>
  )
}

export default ListingDetailPage
