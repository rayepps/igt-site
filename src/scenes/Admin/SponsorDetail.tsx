import * as _ from 'radash'
import * as yup from 'yup'
import { ChangeEventHandler, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import { useAuth } from 'src/hooks/useAuth'
import CreateSponsorCampaignModal from 'src/components/admin/sponsor/CreateSponsorCampaignModal'
import getCampaignComponent from 'src/campaigns'
import { useFormation } from 'src/hooks/useFormation'
import SingleImageUpload from 'src/components/SingleImageUpload'
import imagekit from 'src/imagekit'
import MultiImageUpload from 'src/components/MultiImageUpload'
import RemoveSponsorCampaignModal from 'src/components/admin/sponsor/RemoveSponsorCampaignModal'

export default function AdminSponsorDetailScene({ sponsorId }: { sponsorId: string }) {
  const findSponsorRequest = useFetch(api.sponsors.find)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [removingCampaign, setRemovingCampaign] = useState<t.SponsorCampaign | null>(null)
  const findSponsor = async () => {
    const { error, data } = await findSponsorRequest.fetch(
      { sponsorId },
      {
        token: auth.token!
      }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  useEffect(() => {
    if (!auth.token) return
    findSponsor()
  }, [auth.token])

  const sponsor = findSponsorRequest.data?.sponsor

  return (
    <>
      {addModalOpen && (
        <CreateSponsorCampaignModal
          sponsor={sponsor!}
          open
          onCancel={_.partial(setAddModalOpen, false)}
          onClose={_.partial(setAddModalOpen, false)}
          onComplete={_.chain(_.partial(setAddModalOpen, false), findSponsor)}
        />
      )}
      {removingCampaign && (
        <RemoveSponsorCampaignModal
          sponsor={sponsor!}
          campaign={removingCampaign!}
          open
          onCancel={_.partial(setRemovingCampaign, null)}
          onClose={_.partial(setRemovingCampaign, null)}
          onComplete={_.chain(_.partial(setRemovingCampaign, null), findSponsor)}
        />
      )}
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          {findSponsorRequest.loading && <span>loading...</span>}
          {!findSponsorRequest.loading && sponsor && (
            <SponsorDetailContent
              sponsor={sponsor}
              onCreateCampaign={_.partial(setAddModalOpen, true)}
              onRemoveCampaign={setRemovingCampaign}
            />
          )}
        </div>
      </div>
    </>
  )
}

const SponsorDetailContent = ({
  sponsor,
  onCreateCampaign,
  onRemoveCampaign
}: {
  sponsor: t.Sponsor
  onCreateCampaign?: () => void
  onRemoveCampaign: (campaign: t.SponsorCampaign) => void
}) => {
  const [campaign, setCampaign] = useState(_.first(sponsor.campaigns, null))
  const CampaignComponent = campaign ? getCampaignComponent(campaign.key as any) : null
  return (
    <>
      <div className="flex flex-row justify-between items-center p-10">
        <div>
          <h1 className="font-black text-4xl">{sponsor.name}</h1>
          <span className="text-sm uppercase font-semibold text-slate-300">sponsor</span>
        </div>
        <div></div>
      </div>
      <div className="flex flex-row items-stretch border-t border-slate-200">
        <div className="">
          <div className="flex flex-row items-center justify-between pr-4">
            <h3 className="py-4 pl-4 font-bold text-sm">Campaigns</h3>
            <button onClick={onCreateCampaign} className="p-2 bg-slate-100 group hover:bg-red-600 rounded">
              <HiOutlinePlus className="text-slate-500 group-hover:text-white" />
            </button>
          </div>
          <div>
            {sponsor.campaigns.map((c, i) => (
              <div
                key={c.key}
                className={`flex flex-row items-center relative border-t last:border-b border-slate-200 p-4 ${
                  i % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <div className="grow pr-20">
                  <span
                    className={`${
                      campaign?.key === c.key
                        ? 'border-b border-red-600 text-red-600'
                        : 'hover:underline hover:cursor-pointer'
                    }`}
                    onClick={campaign?.key === c.key ? undefined : _.partial(setCampaign, c)}
                  >
                    {c.name}
                  </span>
                </div>
                <div className={`${campaign?.key === c.key ? 'visible' : 'invisible'}`}>
                  <button className="p-2 bg-slate-100 group rounded" onClick={_.partial(onRemoveCampaign, c)}>
                    <HiOutlineTrash className="text-slate-500 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-x border-r-slate-200">
          {campaign && (
            <div className="">
              <h3 className="my-4 pl-4 font-bold text-sm">Editor</h3>
              <div className="border-t border-slate-200 p-4">
                {sponsor.campaigns.map(camp => (
                  <EditCampaignForm
                    key={camp.key}
                    className={camp.key === campaign.key ? 'block' : 'hidden'}
                    onChange={setCampaign}
                    campaign={camp}
                    sponsor={sponsor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grow">
          {CampaignComponent && campaign && (
            <>
              <h3 className="py-4 pl-4 font-bold text-sm">Preview</h3>
              <div className="border-t border-slate-200 flex flex-row items-center justify-center">
                <div className="max-w-[50vw] pt-4">
                  <CampaignComponent sponsor={sponsor} campaign={campaign} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const EditCampaignForm = ({
  campaign,
  sponsor,
  className = '',
  onChange
}: {
  campaign: t.SponsorCampaign
  sponsor: t.Sponsor
  className?: string
  onChange: (c: t.SponsorCampaign) => void
}) => {
  const updateCampaignRequest = useFetch(api.sponsors.updateCampaign)
  const [images, setImages] = useState<t.Asset[]>([])
  const auth = useAuth()
  const form = useFormation(
    {
      name: yup.string().required(),
      video: yup.string().url(),
      title: yup.string(),
      subtext: yup.string(),
      cta: yup.string(),
      url: yup.string().url()
    },
    {
      name: campaign.name || '',
      video: campaign.video?.url || '',
      title: campaign.title || '',
      subtext: campaign.subtext || '',
      cta: campaign.cta || '',
      url: campaign.url || ''
    }
  )

  const vals = form.watch()
  useEffect(() => {
    onChange({
      ...campaign,
      name: vals.name ?? campaign.name,
      video: vals.video
        ? {
            url: vals.video
          }
        : null,
      title: vals.title ?? campaign.title,
      subtext: vals.subtext ?? campaign.subtext,
      cta: vals.cta ?? campaign.cta,
      url: vals.url ?? campaign.url,
      images: images.length > 0 ? images : campaign.images
    })
  }, [JSON.stringify(vals), images])

  const uploadFiles = async (files: File[]) => {
    const assets = await imagekit.upload(files)
    setImages(assets)
  }

  const submit = async (values: {
    name: string
    video: string
    title: string
    subtext: string
    cta: string
    url: string
  }) => {
    const { error, data } = await updateCampaignRequest.fetch(
      {
        sponsorId: sponsor.id,
        key: campaign.key,
        name: values.name || undefined,
        video: values.video
          ? {
              url: values.video
            }
          : undefined,
        title: values.title || undefined,
        subtext: values.subtext || undefined,
        cta: values.cta || undefined,
        url: values.url || undefined,
        images: images.length > 0 ? images : undefined
      },
      { token: auth.token! }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    toaster.success('Campaign updated!')
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <label>Key</label>
        <input className="border border-gray-200 p-2 w-full" value={campaign.key} disabled type="text" />
      </div>
      <div className="mb-4">
        <label>Name</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="Vertical Sponsors Sidebar"
          {...form.register('name')}
        />
        {form.errors.name?.message && <span className="text-red-700 text-small">{form.errors.name.message}</span>}
      </div>
      <div className="mb-4">
        <label>Title</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="Great Sponsor"
          {...form.register('title')}
        />
        {form.errors.title?.message && <span className="text-red-700 text-small">{form.errors.title.message}</span>}
      </div>
      <div className="mb-4">
        <label>Subtext</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="This great sponsor is incredible!"
          {...form.register('subtext')}
        />
        {form.errors.subtext?.message && <span className="text-red-700 text-small">{form.errors.subtext.message}</span>}
      </div>
      <div className="mb-4">
        <label>CTA</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="Join Now!"
          {...form.register('cta')}
        />
        {form.errors.cta?.message && <span className="text-red-700 text-small">{form.errors.cta.message}</span>}
      </div>
      <div className="mb-4">
        <label>URL</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="https://sponsor.com?utm_campaign=igt-featured&amp;utm_term=amazing"
          {...form.register('url')}
        />
        {form.errors.url?.message && <span className="text-red-700 text-small">{form.errors.url.message}</span>}
      </div>
      <div className="mb-4">
        <label>Images</label>
        <MultiImageUpload onChange={uploadFiles} preview={false} columns={4} />
      </div>
      <div className="mb-4">
        <label>Video</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={updateCampaignRequest.loading}
          type="text"
          placeholder="https://youtube.com/video"
          {...form.register('video')}
        />
        {form.errors.video?.message && <span className="text-red-700 text-small">{form.errors.video.message}</span>}
      </div>
      <div>
        <button
          className="rounded bg-red-600 hover:bg-red-700 p-2 text-white w-full font-semibold"
          onClick={form.createHandler(submit)}
        >
          update
        </button>
      </div>
    </div>
  )
}
