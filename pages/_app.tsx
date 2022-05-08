import { Wrapper } from '@googlemaps/react-wrapper'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import np from 'nprogress'
import Recoil from 'recoil'
import { useCallback, useEffect } from 'react'
import storage from 'src/local-storage'
import useAnalytics from 'src/hooks/useAnalytics'

import 'src/styles/tailwind.css'
import 'src/styles/index.css'
import 'src/styles/nprogress.css'
import 'src/styles/multifile-upload.css'

np.configure({ showSpinner: false })
Router.events.on('routeChangeStart', () => np.start())
Router.events.on('routeChangeComplete', () => np.done())
Router.events.on('routeChangeError', () => np.done())

const VITE_GOOGLE_MAPS_API_KEY = 'AIzaSyBZSrk3zBYiZdBrAwRgRiwYO7YlLeEbIBk'
declare global {
  interface Window {
    iamadmin: () => void
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const analytics = useAnalytics()
  const trackPage = useCallback(
    (url: string) => {
      analytics?.track_page(url)
    },
    [analytics]
  )
  useEffect(() => {
    router.events.on('routeChangeStart', trackPage)
    return () => {
      router.events.off('routeChangeStart', trackPage)
    }
  }, [analytics])
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.iamadmin = () => storage.isAdmin.set(true)
  }, [])
  useEffect(() => {
    if (!analytics) return
    trackPage(window.location.pathname)
  }, [analytics])
  return (
    <>
      <Head>
        <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap"
          rel="stylesheet"
        />
        {process.env.NODE_ENV !== 'development' && (
          <script defer data-domain="idahoguntrader.net" src="https://plausible.io/js/plausible.js" />
        )}
        <title>Idaho Gun Trader - Buy, Sell, Trade, Firearms, Ammo, and More</title>
        <meta id="MetaDescription" name="Description" content="Zero listing fees. Secure and private messaging system. We are Idaho owned and operated and support Idaho Veterans." />
        <meta id="MetaKeywords" name="Keywords" content="Idaho, handguns, rifles, firearms, ammo, classifieds, hunting" />      
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.idahoguntrader.net" />
        <meta property="og:site_name" content="Idaho Gun Trader" />
        <meta property="og:title" content="Idaho Gun Trader - Buy, Sell, Trade, Firearms, Ammo, and More" />
        <meta property="og:description" content="Zero listing fees. Secure and private messaging system. We are Idaho owned and operated and support Idaho Veterans." />
        <meta property="og:image" content="https://www.idahoguntrader.net/us-flag-rifle.jpeg" />
      </Head>
      <Wrapper apiKey={VITE_GOOGLE_MAPS_API_KEY}>
        <Recoil.RecoilRoot>
          <Component {...pageProps} />
        </Recoil.RecoilRoot>
      </Wrapper>
    </>
  )
}

export default MyApp
