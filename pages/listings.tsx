import * as _ from 'radash'
import type { NextPage, NextPageContext, GetServerSidePropsResult } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import ListingsScene from 'src/scenes/Listings'
import * as t from 'src/types'
import api from 'src/api'
import dur from 'durhuman'

export async function getServerSideProps(context: NextPageContext): Promise<GetServerSidePropsResult<Props>> {
  const page = _.toInt(context.query.page) ?? 1
  const size = _.toInt(context.query.size) ?? 25
  const [listings, categories, sponsors] = await Promise.all([
    _.retry(async () => {
      const result = await api.listings.search({
        category: context.query.category as string,
        keywords: context.query.keywords as string,
        near: context.query.zip ? {
          zip: context.query.zip as string,
          proximityInMiles: _.toInt(context.query.distance, 10),
        } : undefined,
        page,
        size,
      })
      if (result.error) throw result.error
      return result
    }, 1),
    _.retry(async () => {
      const result = await api.categories.list({})
      if (result.error) throw result.error
      return result
    }, 1),
    _.retry(async () => {
      const result = await api.sponsors.list({})
      if (result.error) throw result.error
      return result
    }, 1)
  ])
  console.log(listings)
  console.log(categories)
  console.log(sponsors)
  return {
    props: {
      listings: listings.data?.listings ?? [],
      total: listings.data.total ?? 0,
      page,
      size,
      args: context.query as Record<string, string>,
      categories: categories.data?.categories ?? [],
      sponsors: sponsors.data?.sponsors ?? []
    }
  }
}

type Props = {
  listings: t.Listing[]
  categories: t.Category[]
  sponsors: t.Sponsor[]
  args: Record<string, string>,
  total: number
  page: number
  size: number
}

const Home: NextPage<Props> = ({ listings, categories, sponsors, total, page, size, args }) => {
  return (
    <>
      <Header />
      <ListingsScene
        listings={listings}
        categories={categories}
        sponsors={sponsors}
        args={args}
        total={total}
        page={page}
        size={size}
      />
      <Footer />
    </>
  )
}

export default Home
