import Link from 'next/link'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import { useFormation } from 'src/hooks/useFormation'
import * as yup from 'yup'
import { toaster } from 'evergreen-ui'
import { useRouter } from 'next/router'
import storage from 'src/local-storage'
import CategoryPanel from 'src/components/CategoryPanel'
import VerticalSponsorsPanel from 'src/components/VerticalSponsorsPanel'
import Heading from 'src/components/Heading'

export default function ContactScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <ContactForm />
        </div>
        <div className="min-w-[300px]">
          <Heading>Browse Classified</Heading>
          <CategoryPanel categories={categories} />
          <Heading>Our Sponsors</Heading>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}

const ContactForm = () => {
  const router = useRouter()
  const sendMessageRequest = useFetch(api.messaging.sendContactUs)
  const form = useFormation(
    {
      email: yup.string().email().required(),
      message: yup.string().required()
    },
    {
      email: '',
      message: ''
    }
  )

  const submit = async (formData: { email: string; message: string }) => {
    const { error } = await sendMessageRequest.fetch({
      email: formData.email,
      message: formData.message
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    toaster.success('Success! We\'ll respond as soon as we can.')
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-4">Contact Us</h1>
      <div className="mb-4">
        <label>Email</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={sendMessageRequest.loading}
          placeholder="ray@unishine.dev"
          {...form.register('email')}
        />
        {form.errors.email?.message && <span className="text-red-700 text-small">{form.errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label>Message</label>
        <textarea
          className="border border-gray-200 p-2 w-full"
          disabled={sendMessageRequest.loading}
          placeholder="What's on your mind?"
          {...form.register('message')}
        />
        {form.errors.message?.message && (
          <span className="text-red-700 text-small">{form.errors.message.message}</span>
        )}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={sendMessageRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Send
      </button>
    </div>
  )
}
