import { ReactNode } from 'react'

export default function Heading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-2 bg-gray-100 text-black text-2xl uppercase mb-2 ${className}`}>
      <h2>{children}</h2>
    </div>
  )
}
