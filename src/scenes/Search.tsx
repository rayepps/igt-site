import Link from 'next/link'
import * as _ from 'radash'
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

export default function SearchScene({ categories, sponsors }: { categories: t.Category[]; sponsors: t.Sponsor[] }) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <SearchForm categories={categories} />
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

const ALL_DISTANCES: t.LocationDistance[] = ['10', '20', '50', '100', '150']
type FormData = Pick<t.ListingSearchQuery, 'category' | 'distance' | 'keywords' | 'zip'>

const SearchForm = ({
  categories
}: {
  categories: t.Category[]
}) => {
  const router = useRouter()
  const form = useFormation(
    {
      category: yup.string().oneOf(categories.map(c => c.slug)),
      keywords: yup.string(),
      zip: yup.string(),
      distance: yup.string().oneOf(ALL_DISTANCES)
    },
    {
      category: '',
      keywords: '',
      zip: '',
      distance: '10' as t.LocationDistance
    }
  )

  const submit = async (formData: FormData) => {
    const query = _.shake(formData, x => x !== undefined && !!x.trim())
    const qs = new URLSearchParams({
      ...query,
      page: '1',
      size: '25'
    }).toString()
    router.push(`/listings?${qs}`)
  }

  return (
    <div className="max-w-md">
      <h1 className="text-4xl mb-4">Search Listings</h1>
      <div className="mb-4">
        <label>Category</label>
        <select
          className="border border-gray-200 p-2 w-full"
          placeholder="ray@unishine.dev"
          {...form.register('category')}
        >
          {categories.map(c => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
        {form.errors.category?.message && <span className="text-red-700 text-small">{form.errors.category.message}</span>}
      </div>
      <div className="mb-4">
        <label>Keywords</label>
        <input
          className="border border-gray-200 p-2 w-full"
          placeholder="Glock"
          type="text"
          {...form.register('keywords')}
        />
        {form.errors.keywords?.message && <span className="text-red-700 text-small">{form.errors.keywords.message}</span>}
      </div>
      <div className="mb-4">
        <label>Location</label>
        <div className="flex items-center">
          <input
            className="border border-gray-200 p-2 grow mr-2"
            placeholder="83616"
            type="text"
            {...form.register('zip')}
          />
          <span className="block mx-2">within</span>
          <select
            className="border border-gray-200 p-2 grow ml-2"
            {...form.register('distance')}
          >
            {ALL_DISTANCES.map(d => (
              <option key={d} value={d}>{d} miles</option>
            ))}
          </select>
        </div>
        {form.errors.keywords?.message && <span className="text-red-700 text-small">{form.errors.keywords.message}</span>}
      </div>
      <button
        className="w-full bg-red-600 text-white py-2"
        onClick={form.createHandler(submit)}
      >
        Search
      </button>
    </div>
  )
}
