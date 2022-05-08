import _ from 'radash'
import * as t from 'src/types'

export default function VerticalSponsorSidebar_CampaignElement({ campaign }: {
  sponsor: t.Sponsor
  campaign: t.SponsorCampaign
}) {
  const image = _.first(campaign.images, null)
  return (
    <div>
      <a href={campaign.url!} target="_blank">
        <img src={image?.url!} />
      </a>
    </div>
  )
}
