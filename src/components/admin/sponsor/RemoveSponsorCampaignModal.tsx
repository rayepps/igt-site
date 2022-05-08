import { toaster } from 'evergreen-ui'
import { ChangeEventHandler, SyntheticEvent, useState } from 'react'
import api from 'src/api'
import Modal from 'src/components/Modal'
import { useFetch } from 'src/hooks'
import { useFormation } from 'src/hooks/useFormation'
import * as t from 'src/types'
import * as yup from 'yup'
import slugger from 'url-slug'
import { useAuth } from 'src/hooks/useAuth'
import Multiselect from 'src/components/Multiselect'
import { matchSorter } from 'match-sorter'


type FormModel = Pick<t.Sponsor, 'name' | 'status' | 'tier'> & { categoryIds: string[] }

export default function RemoveSponsorCampaignModal({
  open = false,
  sponsor,
  campaign,
  onClose,
  onCancel,
  onComplete
}: {
  open?: boolean
  sponsor: t.Sponsor
  campaign: t.SponsorCampaign
  onClose?: () => void
  onCancel?: () => void
  onComplete?: () => void
}) {
  const removeRequest = useFetch(api.sponsors.removeCampaign)
  const auth = useAuth()
  const form = useFormation<FormModel>(
    {
      name: yup.string().oneOf([campaign.name], 'Name must match campaign').required()
    },
    {
      name: '',
    }
  )

  const submit = async () => {
    const { error } = await removeRequest.fetch({
      sponsorId: sponsor.id,
      key: campaign.key
    }, { token: auth.token! })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    onComplete?.()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md">
        <h1 className="text-4xl mb-4">Remove {campaign.name}</h1>
        <p className="max-w-prose">
          Confirm that you want to delete this campaign by typing in it's name.
        </p>
        <div className="mb-4">
          <label>Name</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={removeRequest.loading}
            placeholder={campaign.name}
            {...form.register('name')}
          />
          {form.errors.name?.message && <span className="text-red-700 text-small">{form.errors.name.message}</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <button className="w-full bg-gray-200 text-gray-600 mr-8 py-2" disabled={removeRequest.loading} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="w-full bg-red-600 text-white py-2"
            disabled={removeRequest.loading}
            onClick={form.createHandler(submit)}
          >
            Remove
          </button>
        </div>
      </div>
    </Modal>
  )
}
