import { useEffect, useState } from 'react'
import formatDate from 'date-fns/format'
import Link from 'next/link'
import {
  HiArrowLeft
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import HorizontalGallery from 'src/components/HorizontalGallery'
import { useRouter } from 'next/router'

export default function AdminEventEditorScene({
  eventId
}: {
  eventId: string
}) {
  const router = useRouter()
  const fetchEventRequest = useFetch(api.events.findById)
  const fetchEvent = async () => {
    const { error } = await fetchEventRequest.fetch({ eventId })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  useEffect(() => {
    fetchEvent()
  }, [])
  const handleChange = (newEvent: t.Event) => {

  }
  const save = () => {

  }
  const goBack = () => {
    router.back()
  }
  return (
    <div className="flex flex-row bg-slate-100">
      <AdminSidebar />
      <div className="grow rounded-tl-2xl bg-white flex flex-row">
        <div className="grow w-full">
          <div className="flex flex-row justify-between">
            <button onClick={goBack} className="p-2 group hover:bg-slate-black bg-slate-100">
              <HiArrowLeft className="text-slate-800 group-hover:text-white" />
            </button>
            <button onClick={save}>
              save
            </button>
          </div>
          <EventEditor 
            event={fetchEventRequest.data?.event}
            loading={fetchEventRequest.loading}
            onChange={handleChange}
          />
        </div>
        <div className="max-w-md w-full">
          <EventEditorAssistant />
        </div>
      </div>
    </div>
  )
}

const EventEditor = ({
  event,
  loading,
  onChange
}: {
  event?: t.Event
  loading: boolean
  onChange: (event: t.Event) => void
}) => {

  return (
    <div>

    </div>
  )
}

const EventEditorAssistant = () => {

  return (
    <span>here</span>
  )
}
