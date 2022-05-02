import * as t from 'src/types'

export default function VerticalSponsorsPanel({ sponsors }: { sponsors: t.Sponsor[] }) {
  const CAMPAIGN = 'home-vert-bar'
  const camps = sponsors.map(s => s.campaigns.find(c => c.key === CAMPAIGN)).filter(c => !!c) as t.SponsorCampaign[]
  return (
    <div>
      {camps.map(camp => (
        <div className="border-b border-slate-200">
          <img src={camp.image!.url} className="w-full h-auto" />
        </div>
      ))}
    </div>
  )
}
