import type { GetServerSideProps, NextPage } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import EditListingScene from 'src/scenes/EditListing'
import * as t from 'src/types'
import api from 'src/api'
import AccountGuard from 'src/components/guards.tsx/AccountGuard'

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

const EditListingPage: NextPage<Props> = ({ listing, sponsors, categories }) => {
  return (
    <AccountGuard redirect={`/login?then=/listing/${listing.slug}/edit`}>
      <Header />
      <EditListingScene listing={listing} sponsors={sponsors} categories={categories} />
      <Footer />
    </AccountGuard>
  )
}

export default EditListingPage
