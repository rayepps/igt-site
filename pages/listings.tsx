import type { NextPage, NextPageContext, GetServerSidePropsResult } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import ListingsScene from 'src/scenes/Listings'
import * as t from 'src/types'
import api from 'src/api'
import dur from 'durhuman'

export async function getServerSideProps(context: NextPageContext): Promise<GetServerSidePropsResult<Props>> {
  const listings = await api.listings.search({
    page: 1,
    pageSize: 25  
  })
  if (listings.error) {
    console.error(listings.error)
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
      listings: listings.data?.listings ?? [],
      categories: categories.data?.categories ?? [],
      sponsors: sponsors.data?.sponsors ?? []
    }
  }
}

type Props = {
  listings: t.Listing[]
  categories: t.Category[]
  sponsors: t.Sponsor[]
}

const Home: NextPage<Props> = ({ listings, categories, sponsors }) => {
  return (
    <>
      <Header />
      <ListingsScene
        listings={listings}
        categories={categories}
        sponsors={sponsors}
      />
      <Footer />
    </>
  )
}

export default Home
