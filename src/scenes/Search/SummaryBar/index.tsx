import * as t from 'src/types'
import { HiOutlineFilter } from 'react-icons/hi'
import Recoil from 'recoil'
import { eventSearchOptionsState, eventSearchState } from 'src/state/events'

export default function SummaryBar({ onToggleFilters }: { onToggleFilters?: () => void }) {
  const [options, setOptions] = Recoil.useRecoilState(eventSearchOptionsState)
  const { total } = Recoil.useRecoilValue(eventSearchState)
  
  const { page, pageSize, order } = options

  const onChange = (newOrder: t.EventSearchOrder) => {
    setOptions({ ...options, order: newOrder })
  }
  const orderOptions: { label: string; value: t.EventSearchOrder }[] = [
    { label: 'Date - Today First', value: 'date:asc' },
    { label: 'Date - Today Last', value: 'date:desc' },
    { label: 'Price - Lowest First', value: 'price:asc' },
    { label: 'Price - Lowest Last', value: 'price:desc' }
  ]
  const start = total === 0 ? 0 : ((page - 1) * pageSize) || 1
  return (
    <div className="flex flex-row items-center">
      <div className="md:hidden">
        <button className="rounded bg-black p-2 mr-4" onClick={onToggleFilters}>
          <HiOutlineFilter size={16} className="text-white" />
        </button>
      </div>
      <div className="grow flex items-center">
        <span className="font-bold mr-2 hidden md:inline">Results:</span>
        <span>
          {start}-{Math.min((start + pageSize - 1), total)} of {total}
        </span>
      </div>
      <div>
        <span className="font-bold mr-2 hidden md:inline">Sort:</span>
        <select value={order} onChange={e => onChange(e.target.value as any)}>
          {orderOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
