import type { GetServerSidePropsResult, NextPage, NextPageContext } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import LogoutScene from 'src/scenes/Logout'
import * as t from 'src/types'
import api from 'src/api'

export async function getServerSideProps(context: NextPageContext): Promise<GetServerSidePropsResult<Props>> {
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
      sponsors: sponsors.data?.sponsors ?? []
    }
  }
}

type Props = {
  categories: t.Category[]
  sponsors: t.Sponsor[]
}

const LogoutPage: NextPage<Props> = ({ categories, sponsors }) => {
  return (
    <>
      <Header />
      <LogoutScene categories={categories} sponsors={sponsors} />
      <Footer />
    </>
  )
}

export default LogoutPage
