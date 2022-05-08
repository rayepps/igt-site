import getCampaignComponent from 'src/campaigns'
import * as t from 'src/types'

export default function VerticalSponsorsPanel({ sponsors }: { sponsors: t.Sponsor[] }) {
  const key: t.CampaignKey = 'vertical-sponsor-sidebar'
  const camps = sponsors.map(s => {
    const campaign = s.campaigns.find(c => c.key === key)
    if (!campaign) return null
    else return {
      campaign,
      sponsor: s
    }
  }).filter(x => !!x) as {
    sponsor: t.Sponsor
    campaign: t.SponsorCampaign
  }[]
  const CampaignComponent = getCampaignComponent('vertical-sponsor-sidebar')
  return (
    <div>
      {camps.map(({ sponsor, campaign }) => (
        <div key={sponsor.id} className="border-b py-8 border-slate-200 flex flex-row justify-center">
          <CampaignComponent sponsor={sponsor} campaign={campaign} />
        </div>
      ))}
    </div>
  )
}
