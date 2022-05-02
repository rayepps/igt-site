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

export default function SignupScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <h1 className="text-4xl mb-4">Register</h1>
          <SignupForm />
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

type FormModal = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  zip: string
  cityState: string
  terms: boolean
}

const SignupForm = () => {
  const router = useRouter()
  const signupRequest = useFetch(api.auth.signup)
  const form = useFormation<FormModal>(
    {
      fullName: yup.string().required('Full name is required'),
      email: yup.string().email('Invalid email format').required('Email is required'),
      password: yup
        .string()
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
        ),
      confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
      zip: yup.string().when('cityState', {
        is: (cs: any) => !cs,
        then: schema => schema.required('Must provide zip or city, state').matches(/^\d{5}$/, 'Invalid zipcode format'),
        otherwise: schema => schema
      }),
      cityState: yup.string(),
      terms: yup.boolean().oneOf([true], 'Must accept terms to create an account').required()
    },
    {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      zip: '',
      cityState: '',
      terms: false
    }
  )

  const submit = async (values: FormModal) => {
    const { error, data } = await signupRequest.fetch({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      terms: values.terms,
      zip: values.zip,
      cityState: values.cityState
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    storage.token.set(data.idToken)
    router.push((router.query.to as string) ?? '/')
  }

  return (
    <div className="max-w-md">
      <div className="mb-4">
        <label>Full Name</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={signupRequest.loading}
          placeholder="John Smith"
          {...form.register('fullName')}
        />
        {form.errors.fullName?.message && (
          <span className="text-red-700 text-small">{form.errors.fullName.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>Email</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={signupRequest.loading}
          placeholder="ray@unishine.dev"
          {...form.register('email')}
        />
        {form.errors.email?.message && <span className="text-red-700 text-small">{form.errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label>Password</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={signupRequest.loading}
          type="password"
          placeholder="**********"
          {...form.register('password')}
        />
        <input
          className="border border-gray-200 mt-2 p-2 w-full"
          disabled={signupRequest.loading}
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
      <div className="mb-4">
        <label>Location</label>
        <div className="flex flex-row justify-between items-center">
          <input
            className="border border-gray-200 p-2 w-full mr-2"
            disabled={signupRequest.loading}
            type="text"
            placeholder="83616"
            {...form.register('zip')}
          />
          <span>or</span>
          <input
            className="border border-gray-200 p-2 w-full ml-2"
            disabled={signupRequest.loading}
            type="text"
            placeholder="City, State"
            {...form.register('cityState')}
          />
        </div>
        {form.errors.zip?.message && <span className="text-red-700 text-small">{form.errors.zip.message}</span>}
        {form.errors.cityState?.message && (
          <span className="text-red-700 text-small">{form.errors.cityState.message}</span>
        )}
      </div>
      <div className="mb-4">
        <div className="flex flex-row items-center">
          <input type="checkbox" className="mr-2" disabled={signupRequest.loading} {...form.register('terms')} />
          <div>
            <span>I agree to the</span>
            <a className="" href="/terms" target="_blank">
              Terms of Use
            </a>
          </div>
        </div>
        {form.errors.terms?.message && <span className="text-red-700 text-small">{form.errors.terms.message}</span>}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={signupRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Register
      </button>
      <div className="mt-10">
        <div className="text-center">
          <span>Already Registered?</span>&nbsp;
          <Link passHref href="/signup">
            <a className="text-blue-500 underline">Login</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
