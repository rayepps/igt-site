import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import HorizontalGallery from 'src/components/HorizontalGallery'
import { useAuth } from 'src/hooks/useAuth'
import EditCategoryModal from 'src/components/admin/category/EditCategoryModal'
import CreateCategoryModal from 'src/components/admin/category/CreateCategoryModal'

export default function AdminCategoriesScene() {
  const listCategoriesRequest = useFetch(api.categories.list)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<null | t.Category>(null)
  const listCategories = async () => {
    const { error } = await listCategoriesRequest.fetch(
      {},
      {
        token: auth.token!
      }
    )
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  const addCategory = () => {
    setAddModalOpen(true)
  }
  const quitEditingCategory = () => {
    setEditingCategory(null)
  }
  const quitCreatingCategory = () => {
    setAddModalOpen(false)
  }
  const startEditingCategory = (cat: t.Category) => {
    setEditingCategory(cat)
  }
  useEffect(() => {
    if (!auth.token) return
    listCategories()
  }, [auth.token])
  return (
    <>
      {editingCategory && (
        <EditCategoryModal
          open
          category={editingCategory}
          onClose={quitEditingCategory}
          onCancel={quitEditingCategory}
          onComplete={quitEditingCategory}
        />
      )}
      <CreateCategoryModal
        open={addModalOpen}
        onCancel={quitCreatingCategory}
        onClose={quitCreatingCategory}
        onComplete={quitCreatingCategory}
      />
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          <div className="flex flex-row justify-between items-center p-10">
            <h1 className="font-black text-4xl">Categories</h1>
            <div>
              <button className="bg-red-500 rounded px-2 py-1 text-white font-bold" onClick={addCategory}>
                Add
              </button>
            </div>
          </div>
          <CategoriesTable
            categories={listCategoriesRequest.data?.categories ?? []}
            loading={listCategoriesRequest.loading}
            onEdit={startEditingCategory}
          />
        </div>
      </div>
    </>
  )
}

const CategoriesTable = ({ 
  categories, 
  loading,
  onEdit
}: { 
  categories: t.Category[]
  loading: boolean 
  onEdit?: (cat: t.Category) => void
}) => {
  const handleAllCheck = () => {}
  const handleCheck = (category: t.Category) => () => {}
  const editCategory = (cat: t.Category) => () => {
    onEdit?.(cat)
  }
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 py-4 pl-4 pr-2">
            <input type="checkbox" onChange={handleAllCheck} />
          </td>
          <td className="border-r border-slate-100 p-4 font-bold">Label</td>
          <td className="border-r border-slate-100 p-4 font-bold">Slug</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {categories.map((category, idx) => (
          <>
            <tr key={category.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
              <td className="py-4 pl-4 pr-2 border-r border-slate-100">
                <input type="checkbox" />
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/categories/${category.id}`} passHref>
                  <a className="hover:underline">{category.label}</a>
                </Link>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>{category.slug}</span>
              </td>
              <td className="py-4 pl-4 pr-1">
                <button className="rounded bg-slate-100 p-2 group hover:bg-black" onClick={editCategory(category)}>
                  <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
                </button>
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )
}
