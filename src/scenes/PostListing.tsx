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
import { useEffect, useState } from 'react'
import { HiCurrencyDollar, HiOutlineCurrencyDollar } from 'react-icons/hi'
import { BsCurrencyDollar } from 'react-icons/bs'
import config from 'src/config'
import MultiImageUpload from 'src/components/MultiImageUpload'
import imagekit from 'src/imagekit'
import { useAuth } from 'src/hooks/useAuth'
import Heading from 'src/components/Heading'
import ListingCard from 'src/components/ListingCard'
import fmt from 'src/fmt'

export default function PostListingScene({
  categories,
  sponsors
}: {
  categories: t.Category[]
  sponsors: t.Sponsor[]
}) {
  return (
    <div className="flex flex-row justify-center pb-20">
      <div className="max-w-7xl w-full flex flex-row items-start">
        <div className="pt-8 mr-8 grow">
          <PostListingForm categories={categories} />
        </div>
        <div className="min-w-[300px] pt-8">
          <Heading>Browse Classified</Heading>
          <CategoryPanel categories={categories} />
          <Heading className="mt-8">Our Sponsors</Heading>
          <VerticalSponsorsPanel sponsors={sponsors} />
        </div>
      </div>
    </div>
  )
}

type FormModel = {
  title: string
  categoryId: string
  description: string
  price: number | null
  videoUrl: string | null
}

const PostListingForm = ({ categories }: { categories: t.Category[] }) => {
  const router = useRouter()
  const auth = useAuth()
  const [currentListing, setCurrentListing] = useState<Partial<t.Listing> | null>(null)
  const postListingRequest = useFetch(api.listings.post)
  const [assets, setAssets] = useState<t.Asset[]>([])
  const form = useFormation<FormModel>(
    {
      title: yup.string().required('Title is required'),
      description: yup.string().required('Description is required'),
      categoryId: yup.string().required('Category is required'),
      price: yup
        .number()
        .integer()
        .positive()
        .transform(value => (isNaN(value) ? null : value))
        .nullable(),
      videoUrl: yup.string().url().nullable()
    },
    {
      title: '',
      categoryId: '',
      description: '',
      price: null,
      videoUrl: null
    }
  )

  const submit = async (values: FormModel) => {
    const { error, data } = await postListingRequest.fetch(
      {
        title: values.title,
        categoryId: values.categoryId as string,
        description: values.description,
        price: values.price,
        videoUrl: values.videoUrl,
        images: assets
      },
      { token: auth.token! }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    router.push('/listings')
  }

  const vals = form.watch()
  useEffect(() => {
    setCurrentListing({
      title: vals.title,
      categoryId: vals.categoryId,
      category: categories.find(c => c.id === vals.categoryId)!,
      description: vals.description,
      price: vals.price ?? 0,
      displayPrice: fmt.price(vals.price ? parseInt(vals.price as any as string) : 0)!,
      video: vals.videoUrl
        ? {
            url: vals.videoUrl
          }
        : null,
      status: 'available',
      images: assets,
      location: auth.user?.location
    })
  }, [JSON.stringify(vals), assets, auth.user?.location])

  return (
    <div className="max-w-md mr-8">
      <h1 className="text-4xl mb-4">Create Classified Listing - Details</h1>
      <div className="mb-4">
        <label>Category</label>
        <select
          className="border border-gray-200 p-2 w-full"
          disabled={postListingRequest.loading}
          placeholder="Select category"
          {...form.register('categoryId')}
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        {form.errors.categoryId?.message && (
          <span className="text-red-700 text-small">{form.errors.categoryId.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>Title</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={postListingRequest.loading}
          type="text"
          placeholder="Glock 17 gen 5"
          {...form.register('title')}
        />
        {form.errors.title?.message && <span className="text-red-700 text-small">{form.errors.title.message}</span>}
      </div>
      <div className="mb-4">
        <label>Description</label>
        <textarea
          className="border border-gray-200 p-2 w-full"
          disabled={postListingRequest.loading}
          placeholder="Good condition. Fired twice. Can meet at..."
          {...form.register('description')}
        />
        {form.errors.description?.message && (
          <span className="text-red-700 text-small">{form.errors.description.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>Price</label>
        <div className="flex flex-row items-center border border-gray-200 p-2 w-full">
          <BsCurrencyDollar className="text-gray-400" />
          <input
            className="grow"
            disabled={postListingRequest.loading}
            type="number"
            min={0}
            max={10000}
            placeholder="600"
            {...form.register('price')}
          />
        </div>
        {form.errors.price?.message && <span className="text-red-700 text-small">{form.errors.price.message}</span>}
      </div>
      <div className="mb-4">
        <label>Video</label>
        <input
          className="border border-gray-200 p-2 w-full"
          disabled={postListingRequest.loading}
          type="text"
          placeholder="https://www.youtube.com/watch?v=6UtgKCBqMFU"
          {...form.register('videoUrl')}
        />
        {form.errors.videoUrl?.message && (
          <span className="text-red-700 text-small">{form.errors.videoUrl.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label>Images</label>
        <MultiImageUpload onChange={setAssets} />
      </div>

      <button
        className="w-full bg-red-600 text-white py-2"
        disabled={postListingRequest.loading}
        onClick={form.createHandler(submit)}
      >
        Post Listing
      </button>
    </div>
  )
}
