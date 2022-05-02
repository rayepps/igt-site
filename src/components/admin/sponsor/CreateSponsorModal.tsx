import { toaster } from 'evergreen-ui'
import api from 'src/api'
import Modal from 'src/components/Modal'
import { useFetch } from 'src/hooks'
import { useFormation } from 'src/hooks/useFormation'
import * as t from 'src/types'
import * as yup from 'yup'
import { useAuth } from 'src/hooks/useAuth'

export default function CreateSponsorModal({
  open = false,
  onClose,
  onCancel,
  onComplete
}: {
  open?: boolean
  onClose?: () => void
  onCancel?: () => void
  onComplete?: (c: t.Sponsor) => void
}) {
  const createRequest = useFetch(api.sponsors.create)
  const auth = useAuth()
  const form = useFormation(
    {
      name: yup.string().required()
    },
    {
      name: ''
    }
  )

  const submit = async (c: { name: string }) => {
    const { data, error } = await createRequest.fetch(
      {
        name: c.name
      },
      { token: auth.token! }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    onComplete?.(data.sponsor)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-md w-full">
        <h1 className="text-4xl mb-4">Add Sponsor</h1>
        <div className="mb-4">
          <label>Name</label>
          <input
            className="border border-gray-200 p-2 w-full"
            disabled={createRequest.loading}
            placeholder="Ted's Gun Store"
            {...form.register('name')}
          />
          {form.errors.name?.message && <span className="text-red-700 text-small">{form.errors.name.message}</span>}
        </div>
        <div className="flex flex-row justify-between items-center">
          <button
            className="w-full bg-gray-200 text-gray-700 mr-8 py-2"
            disabled={createRequest.loading}
            onClick={onCancel}
          >
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
