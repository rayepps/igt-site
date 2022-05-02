import _ from 'radash'
import { ChangeEventHandler, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { matchSorter } from 'match-sorter'
import {
  HiOutlineLocationMarker,
  HiArrowNarrowRight,
  HiOutlineTag,
  HiOutlineBell,
  HiOutlineCash,
  HiOutlinePencil,
  HiExternalLink,
  HiOutlineLink,
  HiOutlineSearch,
  HiX,
  HiOutlineCalendar,
  HiOutlineExclamation,
  HiOutlineMap
} from 'react-icons/hi'
import { useFetch } from 'src/hooks'
import api from 'src/api'
import * as t from 'src/types'
import AdminSidebar from 'src/components/admin/AdminSidebar'
import { toaster } from 'evergreen-ui'
import HorizontalGallery from 'src/components/HorizontalGallery'
import EventCard from 'src/components/EventCard'
import GoogleMap, { MapLocation } from 'src/components/GoogleMap'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'
import { DateRange as ReactDateRange } from 'react-date-range'

import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

type EditorField = 'training' | 'start-date' | 'location' | 'link' | 'sold-out' | 'images'

export default function AdminEventDetailScene({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<t.Event | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [focus, setFocus] = useState<EditorField>('training')
  const fetchTrainingsRequest = useFetch(api.trainings.search)
  const fetchEventRequest = useFetch(api.events.findById)
  const fetchEvent = async () => {
    const { data, error } = await fetchEventRequest.fetch({ eventId })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
    setEvent(data.event)
  }
  const fetchTrainings = async () => {
    const { error } = await fetchTrainingsRequest.fetch({
      order: 'created-at:asc'
    })
    if (error) {
      console.error(error)
      toaster.danger(error.details)
      return
    }
  }
  useEffect(() => {
    fetchEvent()
    fetchTrainings()
  }, [])
  const updateFocus = (newFocus: EditorField) => {
    setFocus(newFocus)
  }
  const setTraining = (newTraining: t.Training) => {
    setEvent(event ? { ...event, training: newTraining } : null)
  }
  const updateEvent = (newEvent: t.Event) => {
    setEvent(newEvent)
  }
  const setLocation = (newLocation: MapLocation) => {
    if (!event) return
    setEvent({
      ...event,
      city: newLocation.city,
      state: newLocation.state,
      location: {
        longitude: newLocation.longitude,
        latitude: newLocation.latitude
      }
    })
  }
  const setDates = (value: { start: Date; end: Date }) => {
    if (!event) return
    setEvent({
      ...event,
      startDate: value.start.toISOString(),
      endDate: value.end.toISOString(),
    })
  }
  return (
    <div className="flex flex-row bg-slate-100">
      <AdminSidebar />
      <div className="grow rounded-tl-2xl bg-white flex flex-row justify-center p-8">
        <div className="max-w-xl min-w-[300px] pr-8 shrink">{event && <EventCard event={event} />}</div>
        <div className="max-w-3xl w-full">
          <EventForm
            event={event}
            loading={fetchEventRequest.loading}
            onFocusChange={updateFocus}
            onEventChange={updateEvent}
          />
        </div>
        <div className="max-w-3xl w-full">
          <EventEditorAssistant
            event={event}
            trainings={fetchTrainingsRequest.data?.trainings ?? []}
            loading={fetchEventRequest.loading}
            focus={focus}
            onTrainingSelect={setTraining}
            onLocationSelect={setLocation}
            onDateSelect={setDates}
          />
        </div>
      </div>
    </div>
  )
}

const EventForm = ({
  event,
  loading,
  onFocusChange,
  onEventChange
}: {
  event: t.Event | null
  loading: boolean
  onFocusChange?: (newFocus: EditorField) => void
  onEventChange?: (newEvent: t.Event) => void
}) => {
  if (!event) {
    return <div>loading...</div>
  }
  const onEditTraining = () => onFocusChange?.('training')
  const onEditStartDate = () => onFocusChange?.('start-date')
  const onEditLocation = () => onFocusChange?.('location')
  const onSoldOutClick = () => {
    onEventChange?.({ ...event, soldOut: !event.soldOut })
  }
  const fmtDates = () => {
    if (!event) return 'none'
    if (!event.startDate) return 'unset'
    const fmt = formatDate
    const start = new Date(event.startDate)
    if (event.endDate && event.startDate !== event.endDate) {
      const end = new Date(event.endDate)
      if (start.getMonth() === end.getMonth()) {
        // July 23-24 2022
        return `${fmt(start, 'MMM dd')}-${fmt(end, 'dd yyyy')}`
      } else {
        // July 30 - August 1 2022
        return `${fmt(start, 'MMM dd')} - ${fmt(end, 'MMM dd yyyy')}`
      }
    } else {
      // July 23 2022
      return `${fmt(start, 'MMM dd yyyy')}`
    }
  }

  const onLocationChange = (location: MapLocation) => {
    onEventChange?.({
      ...event,
      city: location.city,
      state: location.state,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    })
  }

  return (
    <div>
      <div
        onClick={onEditTraining}
        className="bg-slate-50 rounded-xl p-4 flex flex-row items-center hover:cursor-pointer hover:bg-slate-100"
      >
        <div className="grow">
          <span className="block uppercase font-black text-slate-400 text-xs">Training</span>
          <span className="text-slate-900 text-xl block font-bold">{event.training.name}</span>
        </div>
        <div>
          <HiOutlineLink size={24} className="text-slate-900" />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center mt-4">
        <div
          onClick={onEditStartDate}
          className="bg-slate-50 grow mr-2 rounded-xl p-4 flex flex-row items-center hover:cursor-pointer hover:bg-slate-100"
        >
          <div className="grow">
            <span className="block uppercase font-black text-slate-400 text-xs">Date</span>
            <span className="text-slate-900 text-xl block font-bold">
              {fmtDates()}
            </span>
          </div>
          <div>
            <HiOutlineCalendar size={24} className="text-slate-900" />
          </div>
        </div>
        <div
          onClick={onSoldOutClick}
          className="bg-slate-50 grow ml-2 rounded-xl p-4 flex flex-row items-center hover:cursor-pointer hover:bg-slate-100"
        >
          <div className="grow">
            <span className="block uppercase font-black text-slate-400 text-xs">Availability</span>
            <div className="mt-1">
              {event.soldOut && (
                <span className="text-sm py-1 px-2 bg-red-600 rounded text-white font-bold">sold out</span>
              )}
              {!event.soldOut && (
                <span className="text-sm py-1 px-2 bg-green-600 rounded text-white font-bold">available</span>
              )}
            </div>
          </div>
          <div>
            <HiOutlineExclamation size={24} className="text-slate-900" />
          </div>
        </div>
      </div>
      <div
        onClick={onEditLocation}
        className="bg-slate-50 mt-4 rounded-xl p-4 flex flex-row items-center hover:cursor-pointer hover:bg-slate-100"
      >
        <div className="grow">
          <span className="block uppercase font-black text-slate-400 text-xs">Location</span>
          <span className="text-slate-900 text-xl block font-bold">
            {event.city}, {event.state}
          </span>
        </div>
        <div>
          <HiOutlineMap size={24} className="text-slate-900" />
        </div>
      </div>
    </div>
  )
}

const EventEditorAssistant = ({
  event,
  loading,
  trainings,
  focus,
  onTrainingSelect,
  onCreateTraining,
  onLocationSelect,
  onDateSelect
}: {
  event: t.Event | null
  loading: boolean
  trainings: t.Training[]
  focus: EditorField
  onTrainingSelect?: (training: t.Training) => void
  onCreateTraining?: () => void
  onLocationSelect?: (newLocation: MapLocation) => void
  onDateSelect?: (newDates: { start: Date; end: Date }) => void
}) => {
  const [state, setState] = useState<{
    trainingsFilterText: string,
    locationQueryText: string
  }>({
    trainingsFilterText: '',
    locationQueryText: ''
  })

  const geocoder = useMemo(() => {
    return new google.maps.Geocoder()
  }, [])

  if (!event) {
    return <div>loading...</div>
  }

  console.log('focus: ', focus)

  const listTrainings = (): { company: t.Company; trainings: t.Training[] }[] => {
    const matches = state.trainingsFilterText
      ? matchSorter(trainings, state.trainingsFilterText, {
          keys: ['name', 'company.name']
        })
      : trainings
    const companies = _.unique(
      matches.map(m => m.company),
      c => c.id
    )
    return companies.map(company => ({
      company,
      trainings: matches.filter(training => training.company.id === company.id)
    }))
  }

  const clearTrainingFilter = () => {
    setState({ ...state, trainingsFilterText: '' })
  }

  const updateTrainingFilter: ChangeEventHandler<HTMLInputElement> = event => {
    setState({
      ...state,
      trainingsFilterText: event.target.value || ''
    })
  }

  const updateLocationQuery: ChangeEventHandler<HTMLInputElement> = event => {
    setState({
      ...state,
      locationQueryText: event.target.value || ''
    })
  }

  const handleLocationSearch = async () => {
    const response = await geocoder.geocode({ address: state.locationQueryText })
    const [{ address_components: components, geometry }] = response.results
    const city = components.find(x => x.types.includes('locality'))?.long_name ?? ''
    const stateAbbrev = components.find(x => x.types.includes('administrative_area_level_1'))?.long_name ?? ''
    onLocationSelect?.({
      latitude: geometry.location.lat() ?? 0,
      longitude: geometry.location.lng() ?? 0,
      city, state: stateAbbrev
    })
  }

  const handleDateChange = (ranges: {
    selection: {
      endDate: Date
      startDate: Date
    }
  }) => {
    console.log(ranges)
    onDateSelect?.({
      start: ranges.selection.startDate,
      end: ranges.selection.endDate
    }) 
  }

  const trainingList = focus === 'training' ? listTrainings() : []

  return (
    <div className="p-4">
      {focus === 'training' && (
        <div>
          <div className="flex flex-row items-center justify-between">
            <h4 className="font-bold text-xl">Trainings</h4>
            <button
              onClick={onCreateTraining}
              className="py-1 px-2 font-bold rounded text-sm uppercase bg-slate-100 hover:bg-black text-slate-900 hover:text-white"
            >
              new
            </button>
          </div>
          <div className="border-b border-slate-100 flex flex-row items-center mb-2">
            <input
              onChange={updateTrainingFilter}
              type="text"
              value={state.trainingsFilterText}
              placeholder="Search..."
              className="p-2 outline-none grow"
            />
            {state.trainingsFilterText && (
              <HiX onClick={clearTrainingFilter} size={24} className="hover:cursor-pointer" />
            )}
            {!state.trainingsFilterText && <HiOutlineSearch size={24} className="" />}
          </div>
          <div className="">
            {trainingList &&
              trainingList.map(({ company, trainings }) => (
                <div className="mb-4" key={company.id}>
                  <span className="font-bold text-sm text-slate-800">{company.name}</span>
                  <div>
                    {trainings.map(training => (
                      <div
                        key={training.id}
                        onClick={() => onTrainingSelect?.(training)}
                        className="rounded p-2 group hover:bg-slate-50 flex flex-row items-center hover:cursor-pointer justify-between"
                      >
                        <span>{training.name}</span>
                        <HiOutlineLink size={24} className="text-slate-900 invisible group-hover:visible" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            {trainingList.length === 0 && (
              <div className="w-full py-20 bg-slate-50 text-slate-300 font-bold rounded-xl text-center border-dashed border-2 border-slate-300">
                <span>No trainings found</span>
              </div>
            )}
          </div>
        </div>
      )}
      {focus === 'start-date' && (
        <div>
          <div className="flex flex-row items-center">
            <h4 className="font-bold text-xl">Select Date</h4>
          </div>
          <div className="">
            <ReactDateRange
              minDate={new Date()}
              // ranges={ranges}
              ranges={[{
                startDate: new Date(event.startDate ?? undefined),
                endDate: event.endDate ? new Date(event.endDate) : undefined,
                key: 'selection'
              }]}
              onChange={handleDateChange as any}
              // onChange={handleRangeSelect as any}
              moveRangeOnFirstSelection={false}
            />
          </div>
        </div>
      )}
      {focus === 'location' && (
        <div>
          <div className="flex flex-row items-center">
            <h4 className="font-bold text-xl">Location</h4>
          </div>
          <div className="">
            <div className="border-b bg-white p-2 flex flex-row items-center mb-2">
              <input
                onChange={updateLocationQuery}
                type="text"
                value={state.locationQueryText}
                placeholder="Search..."
                className="p-2 outline-none grow"
              />
              <button
                onClick={handleLocationSearch}
                className="rounded bg-slate-100 py-1 px-2 text-slate-700 hover:text-white hover:bg-black"
              >
                search
              </button>
            </div>
            <GoogleMap
              onLocationChange={onLocationSelect}
              className="w-full h-[300px]"
              location={
                event
                  ? {
                      latitude: event.location.latitude,
                      longitude: event.location.longitude,
                      state: event.state,
                      city: event.city
                    }
                  : null
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}
