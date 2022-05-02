import _ from 'radash'
import api from '@exobase/client-builder'
import * as t from './types'
import config from './config'
import type { AxiosRequestConfig } from 'axios'
import storage from 'src/local-storage'

const skipCache = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...config.headers,
      'x-skip-cache': 'yes'
    }
  }
}

const appendSkipCacheHeader = (config: AxiosRequestConfig) => {
  if (typeof window === 'undefined') return config
  if (!storage.skipCache.get()) return config
  return skipCache(config)
}

const createApi = () => {
  const endpoint = api(config.apiUrl as string, appendSkipCacheHeader)
  return {
    auth: {
      login: endpoint<{ email: string; password: string }, { user: t.User; idToken: string }>({
        module: 'auth',
        function: 'login'
      }),
      signup: endpoint<
        {
          fullName: string
          terms: boolean
          email: string
          password: string
          zip?: string
          cityState?: string
        },
        {
          user: t.User
          idToken: string
        }
      >({
        module: 'auth',
        function: 'signup'
      })
    },
    listings: {
      search: endpoint<
        {
          pageSize?: number
          page?: number
          order?: t.ListingOrder
          keywords?: string
          categoryId?: string
          near?: {
            zip: number
            proximity: number
          }
        },
        {
          listings: t.Listing[]
          total: number
        }
      >({
        module: 'listings',
        function: 'search'
      }),
      post: endpoint<
        {
          title: string
          categoryId: string
          description: string
          price: number | null
          images: t.Asset[]
          videoUrl: string | null
        },
        {
          listing: t.Listing
        }
      >({
        module: 'listings',
        function: 'add'
      }),
      findBySlug: endpoint<
        {
          slug: string
        },
        {
          listing: t.Listing
        }
      >({
        module: 'listings',
        function: 'find-by-slug'
      })
    },
    categories: {
      list: endpoint<
        {},
        {
          categories: t.Category[]
        }
      >({
        module: 'categories',
        function: 'list'
      }),
      create: endpoint<
        {
          label: string
          slug: string
        },
        {
          category: t.Category
        }
      >({
        module: 'categories',
        function: 'add'
      }),
      edit: endpoint<
        {
          id: string
          name: string
          status: t.SponsorStatus
          tier: t.SponsorTier
          categoryIds: string[]
        },
        {
          category: t.Category
        }
      >({
        module: 'categories',
        function: 'update'
      })
    },
    assets: {
      authenticate: endpoint<
        {},
        {
          token: string
          expire: number
          signature: string
        }
      >({
        module: 'assets',
        function: 'authenticate'
      })
    },
    users: {
      search: endpoint<
        {
          pageSize?: number
          page?: number
          order?: t.UserOrder
          name?: string
          disabled?: boolean
        },
        {
          users: t.User[]
        }
      >({
        module: 'users',
        function: 'search'
      })
    },
    sponsors: {
      list: endpoint<
        {},
        {
          sponsors: t.Sponsor[]
        }
      >({
        module: 'sponsors',
        function: 'list'
      }),
      create: endpoint<
        {
          name: string
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'add'
      }),
      edit: endpoint<
        {
          id: string
          name: string
          status: t.SponsorStatus
          tier: t.SponsorTier
          categoryIds: string[]
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'update'
      })
    }
  }
}

export default createApi()
