import { ReactNode } from "react"
import { HiX } from "react-icons/hi"

export default function Pill({
  children,
  removeable = false,
  onRemove
}: {
  children: ReactNode
  removeable?: boolean
  onRemove?: () => void
}) {
  return (
    <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-red-700 bg-red-100 border border-red-300">
      <div className="text-xs font-normal leading-none max-w-full flex-initial">{children}</div>
      {removeable && (
        <div className="flex flex-auto flex-row-reverse">
          <div onClick={onRemove}>
            <HiX size={4} className="feather feather-x cursor-pointer hover:text-red-400 rounded-full w-4 h-4 ml-2" />
          </div>
        </div>
      )}
    </div>
  )
}
