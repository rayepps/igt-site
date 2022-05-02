import React, { ReactNode } from 'react'

const Dropdown = <T extends any> ({ 
    list, 
    render = (item: any) => `${item}`,
    onAddItem 
}: {
    list: T[]
    render?: (item: T) => string | number | symbol | ReactNode
    onAddItem: (item: T) => void
}) => {
  return (
    <div
      id="dropdown"
      className="absolute shadow top-100 bg-white min-w-[300px] z-40 lef-0 rounded max-h-select overflow-y-auto "
    >
      <div className="flex flex-col w-full">
        {list.map((item, key) => {
          return (
            <div
              key={key}
              className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-100"
              onClick={() => onAddItem(item)}
            >
              <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                <div className="w-full items-center flex">
                  <div className="mx-2 leading-6  ">{render(item)}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dropdown
