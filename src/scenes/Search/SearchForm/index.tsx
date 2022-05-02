import _ from 'radash'
import { useEffect, useState, memo } from 'react'
import * as t from 'src/types'
import { US_STATES } from 'src/const'
import { HiOutlineBan, HiOutlineLocationMarker, HiX } from 'react-icons/hi'
import parseDate from 'date-fns/parse'
import formatDate from 'date-fns/format'
import endOfMonth from 'date-fns/endOfMonth'
import { Checkbox, SelectMenu, Popover, Position } from 'evergreen-ui'
import Recoil from 'recoil'
import { eventSearchOptionsState } from 'src/state/events'
import DateRange from 'src/components/DateRange'

const allFilterFields: t.EventSearchFilterFields[] = ['company', 'date', 'tags', 'type', 'state']

export const SearchForm = ({
  tags,
  companies,
  geolocation,
  states,
  filters: filterFieldList = allFilterFields,
  overrides
}: {
  tags: t.Tag[]
  companies: t.Company[]
  states: Record<t.StateAbbreviation, number>
  geolocation?: {
    coords: t.GeoLocation | null
    error: GeolocationPositionError | null
    city: string | null
    state: string | null
    ready: boolean
  }
  filters?: t.EventSearchFilterFields[]
  overrides?: Partial<t.EventSearchOptions>
}) => {
  const [options, setOptions] = Recoil.useRecoilState(eventSearchOptionsState)
  const [showDateRange, setShowDateRange] = useState(false)

  const filters = _.objectify(filterFieldList, x => x)
  useEffect(() => {
    if (!overrides) return
    setOptions({
      ...options,
      ...overrides,
      overrides: Object.keys(overrides) as any
    })
  }, [overrides])

  useEffect(() => {
    if (!geolocation?.ready) return
    if (options.state) return
    setOptions({
      ...options,
      near: geolocation.coords ?? undefined
    })
  }, [geolocation?.ready, geolocation?.coords])

  const clearCurrentLocation = () => {
    setOptions({
      ...options,
      near: undefined,
      page: 1
    })
  }

  const applyCurrentLocation = () => {
    if (!geolocation) return
    setOptions({
      ...options,
      near: geolocation.coords ?? undefined,
      state: undefined,
      page: 1
    })
  }

  const setType = (type: t.TrainingType) =>
    setOptions({
      ...options,
      type: type,
      page: 1
    })

  const resetOptions = () =>
    setOptions({
      page: 1,
      pageSize: 25
    })

  const clearType = () =>
    setOptions({
      ...options,
      type: undefined,
      page: 1
    })

  const updateCompany = (companyId: string) => {
    setOptions({
      ...options,
      company: companyId,
      page: 1
    })
  }

  const clearCompany = () => {
    setOptions({
      ...options,
      company: undefined,
      page: 1
    })
  }

  const updateState = (state: string) => {
    setOptions({
      ...options,
      state,
      near: undefined,
      page: 1
    })
  }

  const clearState = () => {
    setOptions({
      ...options,
      state: undefined,
      page: 1
    })
  }

  const removeTag = (tag: t.Tag) => {
    const newTags = options.tags?.filter(slug => slug !== tag.slug) ?? []
    setOptions({
      ...options,
      tags: newTags.length > 0 ? newTags : undefined,
      page: 1
    })
  }

  const clearTags = () => {
    setOptions({
      ...options,
      page: 1,
      tags: undefined
    })
  }

  const addTag = (tagSlug: string) => {
    setOptions({
      ...options,
      tags: _.unique([...(options.tags ?? []), tagSlug]),
      page: 1
    })
  }

  const clearDate = () => {
    setOptions({
      ...options,
      date: undefined,
      page: 1
    })
  }

  const handleDateRange = (range: { start: Date; end: Date }) => {
    setShowDateRange(false)
    const fmt = (date: Date) => formatDate(date, 'dd.MM.yyyy')
    const newDate =
      range.start.getTime() === range.end.getTime() ? fmt(range.start) : `${fmt(range.start)}-${fmt(range.end)}`
    setOptions({
      ...options,
      date: newDate,
      page: 1
    })
  }

  const formatDateDisplay = () => {
    const [startStr, endStr] = options.date?.includes('-')
      ? options.date?.split('-') ?? ['', '']
      : [options.date ?? '', options.date ?? '']
    const start = parseDate(startStr, 'dd.MM.yyyy', new Date())
    const end = parseDate(endStr, 'dd.MM.yyyy', new Date())
    const format = (d: Date) => {
      return formatDate(d, 'MMM do')
    }
    if (start.getTime() === end.getTime()) {
      return format(start)
    }
    return `${format(start)} - ${format(end)}`
  }

  const getDateRangeValue = () => {
    if (!options.date)
      return {
        start: new Date(),
        end: endOfMonth(new Date())
      }
    const [startStr, endStr] = options.date?.includes('-')
      ? options.date?.split('-') ?? ['', '']
      : [options.date ?? '', options.date ?? '']
    return {
      start: parseDate(startStr, 'dd.MM.yyyy', new Date()),
      end: parseDate(endStr, 'dd.MM.yyyy', new Date())
    }
  }

  const hasFiltersSet = (() => {
    if (options.state) return true
    if (options.date) return true
    if (options.tags?.length ?? 0 > 0) return true
    if (options.company) return true
    if (options.type) return true
    return false
  })()

  return (
    <div className="flex flex-col">
      {filters.type && (
        <div className="mb-6">
          <FilterLabel className="mb-1">Type</FilterLabel>
          <div className="flex flex-row justify-between">
            <button
              onClick={() => (options.type !== 'tactical' ? setType('tactical') : clearType())}
              className={`border-black grow border px-2 py-1 rounded hover:bg-black hover:text-white text-black ${
                options.type === 'tactical' && 'text-white bg-black'
              }`}
            >
              Tactical
            </button>
            <button
              onClick={() => (options.type !== 'survival' ? setType('survival') : clearType())}
              className={`border-black grow mx-2 border px-2 py-1 rounded hover:bg-black hover:text-white text-black ${
                options.type === 'survival' && 'text-white bg-black'
              }`}
            >
              Survival
            </button>
            <button
              onClick={() => (options.type !== 'medical' ? setType('medical') : clearType())}
              className={`border-black grow border px-2 py-1 rounded hover:bg-black hover:text-white text-black ${
                options.type === 'medical' && 'text-white bg-black'
              }`}
            >
              Medical
            </button>
          </div>
        </div>
      )}
      {filters.company && (
        <div className="mb-6">
          <FilterLabel className="mb-1">Company</FilterLabel>
          <div className="flex flex-row">
            <SelectMenu
              title="Company"
              options={companies.map(c => ({ label: c.name, value: c.slug }))}
              selected={options.company}
              filterPlaceholder="Choose company"
              onSelect={item => updateCompany(item.value as string)}
            >
              <button className="grow border border-black rounded">
                {options.company ? companies.find(c => c.slug === options.company)?.name : 'Select company'}
              </button>
            </SelectMenu>
            <ClearFilterButton disabled={!options.company} onClick={clearCompany} />
          </div>
        </div>
      )}
      {filters.state && (
        <div className="mb-6">
          <FilterLabel className="mb-1">Location</FilterLabel>
          <div className="flex flex-row mb-2">
            {geolocation && geolocation.ready && options.near && (
              <button
                onClick={clearCurrentLocation}
                className="hover:cursor-pointer group grow bg-blue-500 border border-blue-500 rounded flex items-center justify-center"
              >
                <HiOutlineLocationMarker size={22} className="text-white" />
                <span className="text-white block ml-2">
                  {geolocation.city}, {geolocation.state}
                </span>
              </button>
            )}
            {geolocation && geolocation.ready && !options.near && (
              <button
                onClick={applyCurrentLocation}
                className="hover:cursor-pointer group grow hover:border-blue-500 border border-black rounded flex items-center justify-center"
              >
                <HiOutlineLocationMarker size={22} className="text-black group-hover:text-blue-500" />
                <span className="text-black block ml-2 group-hover:text-blue-500">
                  {geolocation.city}, {geolocation.state}
                </span>
              </button>
            )}
            {geolocation && geolocation.ready && (
              <ClearFilterButton disabled={!options.near} onClick={clearCurrentLocation} />
            )}
          </div>
          <div className="flex flex-row">
            <SelectMenu
              title="State"
              options={Object.entries(states).map(([abbv, count]) => ({ label: `${US_STATES[abbv]} (${count})`, value: abbv }))}
              selected={options.state}
              filterPlaceholder="Choose state"
              onSelect={item => updateState(item.value as string)}
            >
              <button className="grow border border-black rounded">
                {options.state ? US_STATES[options.state] : 'Select state'}
              </button>
            </SelectMenu>
            <ClearFilterButton disabled={!options.state} onClick={clearState} />
          </div>
        </div>
      )}
      {filters.date && (
        <div className="mb-6">
          <FilterLabel className="mb-1">Dates</FilterLabel>
          <div className="flex flex-row">
            <button
              className="border grow border-black rounded p-1 w-full text-center"
              onClick={() => setShowDateRange(!showDateRange)}
            >
              {options.date ? formatDateDisplay() : 'Select Dates'}
            </button>
            <ClearFilterButton disabled={!options.date} onClick={clearDate} />
          </div>
          <Popover
            position={Position.BOTTOM_LEFT}
            isShown={showDateRange}
            content={<DateRange value={getDateRangeValue()} onChange={handleDateRange} />}
          >
            <div></div>
          </Popover>
        </div>
      )}
      {filters.tags && (
        <div className="mb-6">
          <FilterLabel className="mb-1">Tags</FilterLabel>
          <div className="flex flex-row">
            <SelectMenu
              title="Tags"
              options={tags.map(tag => ({ label: tag.name, value: tag.slug }))}
              selected={options.tags}
              filterPlaceholder="Choose tags"
              onSelect={item => addTag(item.value as string)}
            >
              <button className="py-1 grow border border-black rounded">Select tag</button>
            </SelectMenu>
            <ClearFilterButton disabled={!options.tags?.length} onClick={clearTags} />
          </div>
          <div>
            {options.tags?.map(tagSlug => {
              const tag = tags.find(t => t.slug === tagSlug)
              return tag && <Checkbox key={tagSlug} checked label={tag.name} onChange={() => removeTag(tag)} />
            })}
          </div>
        </div>
      )}
      <div className="pt-4 flex flex-row justify-center">
        <button
          disabled={!hasFiltersSet}
          onClick={resetOptions}
          className="font-bold text-sm text-black hover:text-red-600 disabled:text-slate-200 disabled:hover:text-slate-200"
        >
          reset
        </button>
      </div>
    </div>
  )
}

const FilterLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return <label className={'font-bold text-sm block' + ' ' + className}>{children}</label>
}

const ClearFilterButton = ({ disabled, onClick }: { disabled: boolean; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="disabled:bg-white rounded border group disabled:border-slate-100 border-black p-2 ml-1 bg-black"
    >
      <HiX size={15} className="group-disabled:text-slate-200 text-white" />
    </button>
  )
}

export default memo(SearchForm, (propsA, propsB) => {
  return JSON.stringify(propsA) === JSON.stringify(propsB)
})
