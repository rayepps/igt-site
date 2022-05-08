import _ from 'radash'
import * as t from 'src/types'

export default function ListingGridItem_CampaignElement({
  campaign
}: {
  sponsor: t.Sponsor
  campaign: t.SponsorCampaign
}) {
  const image = _.first(campaign.images, null)
  return (
    <a className="block" href={campaign.url!} target="_blank">
      <img src={image?.url!} />
      <span>{campaign.title}</span>
    </a>
  )
}
