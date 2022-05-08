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

export default function ResetPasswordScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <ResetPasswordForm />
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

const ResetPasswordForm = () => {
  const router = useRouter()
  const { id: userId, code } = router.query as { id: string; code: string }
  const resetRequest = useFetch(api.auth.finishReset)
  const [status, setStatus] = useState<'ready' | 'sent'>('ready')
  const form = useFormation(
    {
      password: yup
        .string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
    },
    {
      password: '',
      confirmPassword: ''
    }
  )

  const submit = async (formData: { password: string }) => {
    const { error, data } = await resetRequest.fetch({
      id: userId,
      code,
      password: formData.password,
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    storage.token.set(data.idToken)
    router.push(router.query.then as string ?? '/')
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-4">Forgot Password</h1>
      <p className="max-w-prose">
        {status === "ready" && "We'll send a link to your email so you can reset your password."}
        {status === "sent" && "If the email matches an account we'll send the link."}
      </p>
      <div className="mb-4">
        <label>Password</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={resetRequest.loading}
          type="password"
          placeholder="**********"
          {...form.register('password')}
        />
        <input
          className="border border-gray-200 mt-2 p-2 w-full"
          disabled={resetRequest.loading}
          type="password"
          placeholder="Confirm Password"
          {...form.register('confirmPassword')}
        />
        {form.errors.password?.message && (
          <span className="text-red-700 text-small">{form.errors.password.message}</span>
        )}
        {form.errors.confirmPassword?.message && (
          <span className="text-red-700 text-small">{form.errors.confirmPassword.message}</span>
        )}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={resetRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Reset
      </button>
    </div>
  )
}
