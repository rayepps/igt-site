import React, { SyntheticEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Pane, Heading, majorScale, IconButton } from 'evergreen-ui'
import { HiX } from 'react-icons/hi'

interface Props {
  open?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

export default function ModalWrapper(props: Props) {
  const [isBrowser, setIsBrowser] = useState(false)

  // Makes sure render only happens in browser
  // not in next ssr
  useEffect(() => {
    setIsBrowser(true)
  }, [])

  if (isBrowser) {
    const root = document.getElementById('modal-root')
    if (root) {
      return ReactDOM.createPortal((<Modal {...props} />), root) as JSX.Element
    }
  }
  return null
}

const Modal = ({
  open = false,
  onClose,
  children
}: Props) => {
  const handleCloseClick = (e: SyntheticEvent) => {
    e.preventDefault()
    onClose?.()
  }
  return !open ? null : (
    <>
      <div
        className="flex flex-col items-center justify-center fixed w-screen h-screen top-0 left-0 bg-black-opaque-20"
        onClick={handleCloseClick}
      >
        <div
          className="overflow-y-scroll lg:max-h-[80vh] lg:max-w-2xl p-4 md:p-12 bg-white w-full lg:rounded"
          onClick={(e: SyntheticEvent) => e.stopPropagation()}
        >
          <div>
            {children}
          </div>
        </div>
      </div>
    </>
  )
}