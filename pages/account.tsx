import type { GetServerSidePropsResult, NextPage, NextPageContext } from 'next'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import AccountScene from 'src/scenes/Account'
import * as t from 'src/types'
import api from 'src/api'
import AccountGuard from 'src/components/guards.tsx/AccountGuard'

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

const AccountPage: NextPage<Props> = ({ categories, sponsors }) => {
  return (
    <AccountGuard redirect="/login?then=/account">
      <Header />
      <AccountScene />
      <Footer />
    </AccountGuard>
  )
}

export default AccountPage
