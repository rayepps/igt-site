import type { NextPage } from 'next'
import Head from 'next/head'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import SearchScene from 'src/scenes/Search'
import MarketingPrompts from 'src/components/MarketingPrompts'
import Meta from 'src/Meta'

const SearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <Meta
          title='Search Trainings'
          description='Search tactical, survival, and medical trainings from companies across the US.'
          thumbnailUrl='https://praxisco.us/preview.png'
        />
      </Head >
      <Header links='about' />
      <SearchScene />
      <Footer />
      <MarketingPrompts />
    </>
  )
}

export default SearchPage
