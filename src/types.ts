
export type UserRole = 'user' | 'admin' | 'admin-observer'
export type ListingOrder = `${'price' | 'updated-at'}:${'asc' | 'desc'}`
export type UserOrder = `${'logged-in' | 'created-at'}:${'asc' | 'desc'}`
export type SponsorTier = 'trial' | 'free' | 'partner' | 'featured'
export type SponsorStatus = 'active' | 'disabled'
export type ListingStatus = 'available' | 'sold'
export type CampaignKey = 'vertical-sponsor-sidebar' | 'featured-category-hero' | 'listing-grid-item'

export interface GeoPoint {
  longitude: number
  latitude: number
}

export interface GeoLocation {
  longitude: number
  latitude: number
  city: string
  state: string
  zip: string
}

export interface Asset {
  id: string
  url: string
}

export interface User {
  id: string
  email: string
  createdAt: number
  fullName: string
  phone: string
  role: UserRole
  lastLoggedInAt: number
  location: GeoLocation
}

export type Category = {
  id: string
  label: string
  slug: string
}

export type Sponsor = {
  id: string
  name: string
  status: SponsorStatus
  tier: SponsorTier
  categories: Category[]
  campaigns: SponsorCampaign[]
  createdAt: number
  updatedAt: number
}

export interface SponsorCampaign {
  name: string
  key: string
  images: Asset[]
  video: null | Omit<Asset, 'id'>
  title: null | string
  subtext: null | string
  cta: null | string
  url: null | string
  createdAt: number
  updatedAt: number
}

export type Listing = {
  id: string
  slug: string
  title: string
  status: ListingStatus
  categoryId: string
  category: Category
  description: string
  price: number
  displayPrice: string
  images: Asset[]
  video: Omit<Asset, 'id'> | null
  location: GeoLocation
  userId: string
  user: Pick<User, 'id' | 'fullName'>
  addedAt: number
  updatedAt: number
  expiresAt: number
}

export type ElevatedListing = Listing & {
  user: Pick<User, 'id' | 'fullName' | 'email'>
}

export type ListingReport = {
  id: string
  listingId: string
  status: 'pending' | 'dismissed'
  listing: ElevatedListing
  reports: {
    anonymous: boolean
    user: Pick<User, 'id' | 'email' | 'fullName'> | null
    timestamp: number
    snapshot: ElevatedListing
    message: string
  }[]
  dismissedAt: number
  dismissedBy: Pick<User, 'id' | 'email' | 'fullName'>
  expiresAt: number
  createdAt: number
  updatedAt: number
}

export type LocationDistance = '10' | '20' | '50' | '100' | '150'

export type ListingSearchQuery = {
  category?: string
  keywords?: string
  zip?: string
  distance?: LocationDistance
  page?: number
  size?: number
}
