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
import formatDistance from 'date-fns/formatDistance'
// import EditUserModal from 'src/components/admin/user/EditUserModal'
// import CreateUserModal from 'src/components/admin/user/CreateUserModal'

export default function AdminAccountsScene() {

  const searchUsersRequest = useFetch(api.users.search)
  const auth = useAuth()
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<null | t.User>(null)
  const listAccounts = async () => {
    const { error } = await searchUsersRequest.fetch(
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
  const addUser = () => {
    setAddModalOpen(true)
  }
  const quitEditingUser = () => {
    setEditingUser(null)
  }
  const quitCreatingUser = () => {
    setAddModalOpen(false)
  }
  const startEditingUser = (cat: t.User) => {
    setEditingUser(cat)
  }
  useEffect(() => {
    if (!auth.token) return
    listAccounts()
  }, [auth.token])
  return (
    <>
      {/* {editingUser && (
        <EditUserModal
          open
          user={editingUser}
          onClose={quitEditingUser}
          onCancel={quitEditingUser}
          onComplete={quitEditingUser}
        />
      )}
      <CreateUserModal
        open={addModalOpen}
        onCancel={quitCreatingUser}
        onClose={quitCreatingUser}
        onComplete={quitCreatingUser}
      /> */}
      <div className="flex flex-row bg-slate-100">
        <AdminSidebar />
        <div className="grow rounded-tl-2xl bg-white">
          <div className="flex flex-row justify-between items-center p-10">
            <h1 className="font-black text-4xl">Accounts</h1>
            <div>
              <button className="bg-red-500 rounded px-2 py-1 text-white font-bold" onClick={addUser}>
                Add
              </button>
            </div>
          </div>
          <UsersTable
            users={searchUsersRequest.data?.users ?? []}
            loading={searchUsersRequest.loading}
            onEdit={startEditingUser}
          />
        </div>
      </div>
    </>
  )
}

const UsersTable = ({
  users,
  loading,
  onEdit
}: {
  users: t.User[]
  loading: boolean
  onEdit?: (cat: t.User) => void
}) => {
  const handleAllCheck = () => {}
  const handleCheck = (user: t.User) => () => {}
  const editUser = (cat: t.User) => () => {
    onEdit?.(cat)
  }
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 py-4 pl-4 pr-2">
            <input type="checkbox" onChange={handleAllCheck} />
          </td>
          <td className="border-r border-slate-100 p-4 font-bold">Name</td>
          <td className="border-r border-slate-100 p-4 font-bold">Email</td>
          <td className="border-r border-slate-100 p-4 font-bold">Phone</td>
          <td className="border-r border-slate-100 p-4 font-bold">Last Visit</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <>
            <tr key={user.id} className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
              <td className="py-4 pl-4 pr-2 border-r border-slate-100">
                <input type="checkbox" />
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/users/${user.id}`} passHref>
                  <a className="hover:underline">{user.fullName}</a>
                </Link>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>{user.email}</span>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>{user.phone ?? ''}</span>
              </td>
              <td className="p-4 border-r border-slate-100">
                {user.lastLoggedInAt && (
                  <span>{formatDistance(new Date(user.lastLoggedInAt), new Date(), { addSuffix: true })}</span>
                )}
                {!user.lastLoggedInAt && (
                  <span>never</span>
                )}
              </td>
              <td className="py-4 pl-4 pr-1">
                <button className="rounded bg-slate-100 p-2 group hover:bg-black" onClick={editUser(user)}>
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
