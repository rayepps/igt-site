import { toaster } from 'evergreen-ui'
import { ChangeEventHandler, SyntheticEvent } from 'react'
import api from 'src/api'
import Modal from 'src/components/Modal'
import { useFetch } from 'src/hooks'
import { useFormation } from 'src/hooks/useFormation'
import * as t from 'src/types'
import * as yup from 'yup'
import slugger from 'url-slug'
import { useAuth } from 'src/hooks/useAuth'

export default function CreateSponsorCampaignModal({
  sponsor,
  open = false,
  onClose,
  onCancel,
  onComplete
}: {
  sponsor: t.Sponsor
  open?: boolean
  onClose?: () => void
  onCancel?: () => void
  onComplete?: (c: t.SponsorCampaign) => void
}) {
  const createCampaign = useFetch(api.sponsors.addCampaign)
  const auth = useAuth()
  const form = useFormation(
    {
      name: yup.string().required(),
      key: yup
        .string()
        .matches(/^[a-z0-9\-]*$/)
        .required()
    },
    {
      name: '',
      key: ''
    }
  )

  const submit = async (values: { name: string; key: string }) => {
    const { data, error } = await createCampaign.fetch({
      sponsorId: sponsor.id,
      name: values.name,
      key: values.key,
      images: [],
      video: null,
      title: null,
      subtext: null,
      cta: null,
      url: null,
    }, { token: auth.token! })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    onComplete?.(data.sponsor.campaigns.find(c => c.key === values.key)!)
  }

  const onNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (form.dirtyFields.key) return
    form.setValue('key', slugger(event.target.value), { shouldDirty: false })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md w-full">
        <h1 className="text-4xl mb-4">Create Campaign</h1>
        <div className="mb-4">
          <label>Name</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={createCampaign.loading}
            placeholder="Vertical Sponsor Sidebar"
            {...form.register('name', { onChange: onNameChange })}
          />
          {form.errors.name?.message && <span className="text-red-700 text-small">{form.errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label>Key</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={createCampaign.loading}
            type="text"
            placeholder="vertical-sponsor-sidebar"
            {...form.register('key')}
          />
          {form.errors.key?.message && <span className="text-red-700 text-small">{form.errors.key.message}</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <button className="w-full bg-gray-200 text-gray-700 mr-8 py-2" disabled={createCampaign.loading} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="w-full bg-red-600 text-white py-2"
            disabled={createCampaign.loading}
            onClick={form.createHandler(submit)}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  )
}
