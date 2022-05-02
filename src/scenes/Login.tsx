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

export default function LoginScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <LoginForm />
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

const LoginForm = () => {
  const router = useRouter()
  const loginRequest = useFetch(api.auth.login)
  const form = useFormation(
    {
      email: yup.string().email().required(),
      password: yup.string().required()
    },
    {
      email: '',
      password: ''
    }
  )

  const submit = async (formData: { email: string; password: string }) => {
    const { error, data } = await loginRequest.fetch({
      email: formData.email,
      password: formData.password
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    console.log(data)
    storage.token.set(data.idToken)
    router.push(router.query.then as string ?? '/')
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-4">Login</h1>
      <div className="mb-4">
        <label>Email</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={loginRequest.loading}
          placeholder="ray@unishine.dev"
          {...form.register('email')}
        />
        {form.errors.email?.message && <span className="text-red-700 text-small">{form.errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={loginRequest.loading}
          type="password"
          placeholder="**********"
          {...form.register('password')}
        />
        {form.errors.password?.message && (
          <span className="text-red-700 text-small">{form.errors.password.message}</span>
        )}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={loginRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Login
      </button>
      <div className="mt-10">
        <div className="text-center">
          <span>Not Registered?</span>&nbsp;
          <Link passHref href="/signup">
            <a className="text-blue-500 underline">Click here to Register</a>
          </Link>
        </div>
        <div className="text-center mt-2">
          <Link passHref href="/forgot-password">
            <a className="text-blue-500">Forgot your password?</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
