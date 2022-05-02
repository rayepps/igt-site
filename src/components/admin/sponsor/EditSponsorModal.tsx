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

export default function EditSponsorModal({
  open = false,
  sponsor,
  categories,
  onClose,
  onCancel,
  onComplete
}: {
  open?: boolean
  sponsor: t.Sponsor
  categories: t.Category[],
  onClose?: () => void
  onCancel?: () => void
  onComplete?: (c: t.Sponsor) => void
}) {
  const editRequest = useFetch(api.sponsors.edit)
  const auth = useAuth()
  const [categoryIds, setCategoryIds] = useState<string[]>(sponsor?.categories.map(c => c.id) ?? [])
  const form = useFormation<FormModel>(
    {
      name: yup.string().required(),
      status: yup.string().required(),
      tier: yup.string().required()
    },
    {
      name: sponsor?.name ?? '',
      status: sponsor?.status ?? 'disabled',
      tier: sponsor?.tier ?? 'trial'
    }
  )

  const submit = async (model: FormModel) => {
    const { data, error } = await editRequest.fetch({
      id: sponsor.id,
      ...model,
      categoryIds
    }, { token: auth.token! })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    onComplete?.(data.sponsor)
  }

  const searchCategories = (text: string, cats: t.Category[]) => {
    return matchSorter(cats, text, {
      keys: ['label']
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md">
        <h1 className="text-4xl mb-4">Edit Sponsor</h1>
        <div className="mb-4">
          <label>Label</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={editRequest.loading}
            placeholder="Ted's Gun Store"
            {...form.register('name')}
          />
          {form.errors.name?.message && <span className="text-red-700 text-small">{form.errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label>Status</label>
          <select
            className="w-full border border-gray-200 p-2 block"
            {...form.register('status')}
          >
            <option value="active" selected={form.watch().status === 'active'}>Active</option>
            <option value="disabled" selected={form.watch().status === 'disabled'}>Disabled</option>
          </select>
          {form.errors.status?.message && <span className="text-red-700 text-small">{form.errors.status.message}</span>}
        </div>
        <div className="mb-4">
          <label>Tier</label>
          <select
            className="w-full border border-gray-200 p-2 block"
            {...form.register('tier')}
          >
            <option value="trial" selected={form.watch().tier === 'trial'}>Trial</option>
            <option value="free" selected={form.watch().tier === 'free'}>Free</option>
            <option value="partner" selected={form.watch().tier === 'partner'}>Partner</option>
            <option value="featured" selected={form.watch().tier === 'featured'}>Featured</option>
          </select>
          {form.errors.tier?.message && <span className="text-red-700 text-small">{form.errors.tier.message}</span>}
        </div>
        <div className="mb-4">
          <label>Categories</label>
          <Multiselect
            items={categories}
            render={(cat) => cat.label}
            search={searchCategories}
            selected={categories.filter(c => categoryIds.includes(c.id))}
            onChange={(cats) => setCategoryIds(cats.map(c => c.id))}
          />
          {form.errors.tier?.message && <span className="text-red-700 text-small">{form.errors.tier.message}</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <button className="w-full bg-gray-200 text-gray-600 mr-8 py-2" disabled={editRequest.loading} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="w-full bg-red-600 text-white py-2"
            disabled={editRequest.loading}
            onClick={form.createHandler(submit)}
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  )
}
