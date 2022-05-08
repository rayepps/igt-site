import _ from 'radash'
import * as t from 'src/types'

export default function CategoryFeaturedHero_CampaignElement({ campaign }: {
  sponsor: t.Sponsor
  campaign: t.SponsorCampaign
}) {
  if (!campaign) return null
  const [imageOne, imageTwo] = campaign.images?.length >= 2 ? campaign.images : [null, null]
  return (
    <div className="flex flex-row">
      <img src={imageOne?.url} className="grow h-40 object-cover" />
      <div className="grow text-center">
        <span className="font-bold text-2xl">{campaign.title}</span>
        <p className="max-w-prose ">{campaign.subtext}</p>
        <a href={campaign.url ?? ''} target="_blank">
          <button className="border border-slate-200 text-red-600 py-2 px-4">{campaign.cta}</button>
        </a>
      </div>
      <img src={imageTwo?.url} className="grow h-40 object-cover" />
    </div>
  )
}
