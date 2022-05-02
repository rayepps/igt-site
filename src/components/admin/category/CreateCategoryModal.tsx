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

export default function CreateCategoryModal({
  open = false,
  onClose,
  onCancel,
  onComplete
}: {
  open?: boolean
  onClose?: () => void
  onCancel?: () => void
  onComplete?: (c: t.Category) => void
}) {
  const createRequest = useFetch(api.categories.create)
  const auth = useAuth()
  const form = useFormation(
    {
      label: yup.string().required(),
      slug: yup
        .string()
        .matches(/^[a-z0-9\-]*$/)
        .required()
    },
    {
      label: '',
      slug: ''
    }
  )

  const submit = async (c: { label: string; slug: string }) => {
    const { data, error } = await createRequest.fetch({
      label: c.label,
      slug: c.slug
    }, { token: auth.token! })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    onComplete?.(data.category)
  }

  const onLabelChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (form.dirtyFields.slug) return
    form.setValue('slug', slugger(event.target.value), { shouldDirty: false })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md w-full">
        <h1 className="text-4xl mb-4">Add Category</h1>
        <div className="mb-4">
          <label>Label</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={createRequest.loading}
            placeholder="Ammo &amp; Brass"
            {...form.register('label', { onChange: onLabelChange })}
          />
          {form.errors.label?.message && <span className="text-red-700 text-small">{form.errors.label.message}</span>}
        </div>
        <div className="mb-4">
          <label>Slug</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={createRequest.loading}
            type="text"
            placeholder="ammo-and-brass"
            {...form.register('slug')}
          />
          {form.errors.slug?.message && <span className="text-red-700 text-small">{form.errors.slug.message}</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <button className="w-full bg-gray-200 text-gray-700 mr-8 py-2" disabled={createRequest.loading} onClick={onCancel}>
            Cancel
          </button>
          <button
            className="w-full bg-red-600 text-white py-2"
            disabled={createRequest.loading}
            onClick={form.createHandler(submit)}
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  )
}
