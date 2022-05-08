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
import { useState } from 'react'

export default function ForgotPasswordScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <ForgotPasswordForm />
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

const ForgotPasswordForm = () => {
  const resetRequest = useFetch(api.auth.startReset)
  const [status, setStatus] = useState<'ready' | 'sent'>('ready')
  const form = useFormation(
    {
      email: yup.string().email().required()
    },
    {
      email: ''
    }
  )

  const submit = async (formData: { email: string }) => {
    const { error, data } = await resetRequest.fetch({
      email: formData.email,
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    console.log(data)
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-4">Forgot Password</h1>
      <p className="max-w-prose">
        {status === "ready" && "We'll send a link to your email so you can reset your password."}
        {status === "sent" && "If the email matches an account we'll send the link."}
      </p>
      <div className="mb-4">
        <label>Email</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={resetRequest.loading}
          placeholder="ray@unishine.dev"
          {...form.register('email')}
        />
        {form.errors.email?.message && <span className="text-red-700 text-small">{form.errors.email.message}</span>}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={resetRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Send Email
      </button>
    </div>
  )
}
