import * as t from 'src/types'
import Link from 'next/link'

export default function CategoryPanel({ categories }: { categories: t.Category[] }) {
  return (
    <div className="border border-slate-200 p-6">
      {categories.map(cat => (
        <a
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="block mb-2 last:mb-0 hover:underline text-lg whitespace-nowrap"
        >
          {cat.label}
        </a>
      ))}
    </div>
  )
}
