import { useState } from 'react'
import { DateRange as ReactDateRange } from 'react-date-range'

export default function DateRange({
  value,
  className = '',
  onChange
}: {
  className?: string
  value?: {
    start: Date
    end: Date
  }
  onChange?: (value: { start: Date; end: Date }) => void
}) {
  const [state, setState] = useState({
    startDate: value?.start ?? new Date(),
    endDate: value?.end ?? null,
    key: 'selection'
  })
  const handleOk = () => {
    onChange?.({
      start: state.startDate,
      end: state.endDate as Date
    })
  }

  return (
    <div className={className}>
      <div>
        <ReactDateRange
          minDate={new Date()}
          // ranges={ranges}
          ranges={[state as any]}
          onChange={item => setState(item.selection as any)}
          // onChange={handleRangeSelect as any}
          moveRangeOnFirstSelection={false}
        />
      </div>
      <div className="flex flex-row justify-between px-2 pb-2">
        <div></div>
        <button onClick={handleOk} className="bg-black text-white p-2 rounded">
          ok
        </button>
      </div>
    </div>
  )
}
