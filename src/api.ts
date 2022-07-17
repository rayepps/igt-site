import * as _ from 'radash'
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
  // return skipCache(config)
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
      }),
      startReset: endpoint<{ 
        email: string; 
      }, {}>({
        module: 'auth',
        function: 'start-reset'
      }),
      finishReset: endpoint<{ id: string; code: string; password: string }, { user: t.User; idToken: string }>({
        module: 'auth',
        function: 'finish-reset'
      })
    },
    listings: {
      search: endpoint<
        {
          size?: number
          page?: number
          order?: t.ListingOrder
          keywords?: string
          category?: string
          postedById?: string
          near?: {
            zip: string
            proximityInMiles: number
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
      update: endpoint<
        {
          id: string
          title: string
          categoryId: string
          description: string
          price: number | null
          images: t.Asset[]
          videoUrl: string | null
          status: t.ListingStatus
        },
        {
          listing: t.Listing
        }
      >({
        module: 'listings',
        function: 'update'
      }),
      delete: endpoint<{ id: string }, {}>({
        module: 'listings',
        function: 'delete'
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
      }),
      findById: endpoint<
        {
          id: string
        },
        {
          listing: t.Listing
        }
      >({
        module: 'listings',
        function: 'find-by-id'
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
      }),
      getSelf: endpoint<
        {},
        {
          user: t.User
        }
      >({
        module: 'users',
        function: 'get-self'
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
      find: endpoint<
        {
          sponsorId: string
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'find'
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
      }),
      remove: endpoint<
        {
          sponsorId: string
        },
        {}
      >({
        module: 'sponsors',
        function: 'remove'
      }),
      addCampaign: endpoint<
        {
          sponsorId: string
          name: string
          key: string
          images: t.Asset[]
          video: null | Omit<t.Asset, 'id'>
          title: null | string
          subtext: null | string
          cta: null | string
          url: null | string
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'add-campaign'
      }),
      updateCampaign: endpoint<
        {
          sponsorId: string
          key: string
          name?: string
          images?: t.Asset[]
          video?: Omit<t.Asset, 'id'>
          title?: string
          subtext?: string
          cta?: string
          url?: string
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'update-campaign'
      }),
      removeCampaign: endpoint<
        {
          sponsorId: string
          key: string
        },
        {
          sponsor: t.Sponsor
        }
      >({
        module: 'sponsors',
        function: 'remove-campaign'
      })
    },
    reports: {
      list: endpoint<{

      }, {
        reports: t.ListingReport[]
      }
      >({
        module: 'reports',
        function: 'list'
      }),
      submit: endpoint<{
        listingId: string
        message: string
      }, {
        report: t.ListingReport
      }>({
        module: 'reports',
        function: 'submit'
      }),
      dismiss: endpoint<{
        id: string
      }, {
        report: t.ListingReport
      }>({
        module: 'reports',
        function: 'dismiss'
      })
    },
    messaging: {
      sendContactUs: endpoint<{
        email: string
        message: string
      }, {}>({
        module: 'messaging',
        function: 'send-contact-us'
      })
    }
  }
}

export default createApi()
