
export type UserRole = 'user' | 'admin' | 'admin-observer'
export type ListingOrder = `${'price' | 'updated-at'}:${'asc' | 'desc'}`
export type UserOrder = `${'logged-in' | 'created-at'}:${'asc' | 'desc'}`
export type SponsorTier = 'trial' | 'free' | 'partner' | 'featured'
export type SponsorStatus = 'active' | 'disabled'
export type ListingStatus = 'available' | 'sold'

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
  image: null | Asset
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
}