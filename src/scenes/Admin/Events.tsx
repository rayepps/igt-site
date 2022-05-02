import { useEffect, useState } from 'react'
import formatDate from 'date-fns/format'
import Link from 'next/link'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil,
  HiExternalLink,
  HiOutlineEye
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import HorizontalGallery from 'src/components/HorizontalGallery'

export default function AdminEventsScene() {
  const listEventsRequest = useFetch(api.events.search)
  const listEvents = async () => {
    const { error } = await listEventsRequest.fetch({
      order: 'created-at:asc'
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  useEffect(() => {
    listEvents()
  }, [])
  return (
    <div className="flex flex-row bg-slate-100">
      <AdminSidebar />
      <div className="grow rounded-tl-2xl bg-white">
        <h1 className="font-black text-4xl pl-10 pt-10 mb-4">Events</h1>
        <EventsTable events={listEventsRequest.data?.events ?? []} loading={listEventsRequest.loading} />
      </div>
    </div>
  )
}

const EventsTable = ({ events, loading }: { events: t.Event[]; loading: boolean }) => {
  const handleAllCheck = () => {}
  const handleCheck = (event: t.Event) => () => {}
  const gotoEvent = (event: t.Event) => () => {}
  return (
    <table className="w-full">
      <thead className="border-y border-slate-100">
        <tr>
          <td className="border-r border-slate-100 py-4 pl-4 pr-2">
            <input type="checkbox" onChange={handleAllCheck} />
          </td>
          <td className="border-r border-slate-100 p-4 font-bold">Date &amp; Time</td>
          <td className="border-r border-slate-100 p-4 font-bold">Location</td>
          <td className="border-r border-slate-100 p-4 font-bold">Company</td>
          <td className="border-r border-slate-100 p-4 font-bold">Training</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        {events.map((event, idx) => (
          <>
            <tr className={`border-b border-slate-100 ${idx % 2 === 0 && 'bg-slate-50'}`}>
              <td className="p-4 border-r border-slate-100">
                <input type="checkbox" onChange={handleCheck(event)} />
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/event/${event.id}`} passHref>
                  <a className="hover:underline">
                    {event.startDate && event.endDate && (`
                      ${formatDate(new Date(event.startDate), 'MMM dd')} - ${formatDate(new Date(event.endDate), 'MMM dd yyyy')}
                    `)}
                    {event.startDate && !event.endDate && (`
                      - ${formatDate(new Date(event.endDate), 'mm.dd.yyyy')}
                    `)}
                    {!event.startDate && !event.endDate && ('none')}
                  </a>
                </Link>
              </td>
              <td className="p-4 border-r border-slate-100">
                <span>
                  {event.city}, {event.state}
                </span>
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/companies/${event.training.company.id}`} passHref>
                  <a className="hover:underline">{event.training.company.name}</a>
                </Link>
              </td>
              <td className="p-4 border-r border-slate-100">
                <Link href={`/hq/trainings/${event.training.id}`} passHref>
                  <a className="hover:underline">{event.training.name}</a>
                </Link>
              </td>
              <td className="py-4 pl-4 pr-1">
                <Link href={`/hq/event/${event.id}/edit`} passHref>
                  <a className="hover:underline mr-2">
                    <button className="rounded bg-slate-100 p-2 group hover:bg-black">
                      <HiOutlinePencil className="text-slate-500 group-hover:text-white" />
                    </button>
                  </a>
                </Link>
                <Link href={`/e/${event.slug}`} passHref>
                  <a className="hover:underline">
                    <button className="rounded bg-slate-100 p-2 group hover:bg-black">
                      <HiExternalLink className="text-slate-500 group-hover:text-white" />
                    </button>
                  </a>
                </Link>
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )
}
