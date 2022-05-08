import * as t from 'src/types'
import { FC } from 'react'
import VerticalSponsorSidebar from 'src/components/campaigns/vertical-sponsor-sidebar'
import CategoryFeaturedHero from 'src/components/campaigns/category-featured-hero'
import ListingGridItem from 'src/components/campaigns/listing-grid-item'

type CampaignComponentProps = {
    campaign: t.SponsorCampaign
    sponsor: t.Sponsor
}

const BlankCampaignComponent: FC<CampaignComponentProps> = () => {
    return null
}

export const CAMPAIGN: Record<t.CampaignKey, t.CampaignKey> = {
    'vertical-sponsor-sidebar': 'vertical-sponsor-sidebar',
    'featured-category-hero': 'featured-category-hero',
    'listing-grid-item': 'listing-grid-item'
}

export default function getCampaignComponent(campaignKey: t.CampaignKey): FC<CampaignComponentProps> {
    switch (campaignKey) {
        case CAMPAIGN['vertical-sponsor-sidebar']:
            return VerticalSponsorSidebar
        case CAMPAIGN['featured-category-hero']:
            return CategoryFeaturedHero
        case CAMPAIGN['listing-grid-item']:
            return ListingGridItem
        default:
            return BlankCampaignComponent
    }
}