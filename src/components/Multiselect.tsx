import React, { ReactNode, useState } from 'react'
import { HiChevronDown } from 'react-icons/hi'
import Dropdown from './Dropdown'
import Pill from './Pill'

const Multiselect = <T extends any>({
  items,
  selected,
  search,
  render = (item: any) => `${item}`,
  onChange
}: {
  items: T[]
  selected: T[]
  search: (filter: string, items: T[]) => T[]
  render?: (item: T) => string | number | symbol | ReactNode
  onChange?: (selected: T[]) => void
}) => {
  const [dropdown, setDropdown] = useState(false)
  const [filter, setFilter] = useState('')

  const filteredItems = !!filter ? search(filter, items) : items

  const toogleDropdown = () => setDropdown(!dropdown)
  const onInputBlur = () => {
    // setDropdown(false)
  }
  const onInputFocus = () => {
    setDropdown(true)
  }

  const addItem = (item: T) => {
    console.log('adding ', item)
    onChange?.([...selected, item])
    setFilter('')
    setDropdown(false)
  }

  const removeItem = (item: T) => {
    onChange?.(selected.filter(e => e !== item))
  }

  return (
    <div className="autcomplete-wrapper">
      <div className="autcomplete">
        <div className="w-full flex flex-col items-center mx-auto">
          <div className="w-full">
            <div className="flex flex-col items-center relative">
              <div className="w-full ">
                <div className="my-2 p-1 flex border border-gray-200 bg-white rounded ">
                  <div className="flex flex-auto flex-wrap">
                    {selected.map((item, index) => {
                      return (
                        <Pill key={index} removeable onRemove={() => removeItem(item)}>
                          {render(item)}
                        </Pill>
                      )
                    })}
                    <div className="flex-1">
                      <input
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        placeholder=""
                        onFocus={onInputFocus}
                        onBlur={onInputBlur}
                        className="bg-transparent p-1 px-2 appearance-none outline-none h-full w-full text-gray-800"
                      />
                    </div>
                  </div>
                  <div
                    className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200"
                    onClick={toogleDropdown}
                  >
                    <button className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none">
                      <HiChevronDown size={4} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {dropdown ? <Dropdown list={filteredItems} onAddItem={addItem} render={render}></Dropdown> : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Multiselect
