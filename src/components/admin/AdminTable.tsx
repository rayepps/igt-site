
export type Column <T> = {
  label: string
}

export default function AdminTable <T> ({
  columns,
  items
}: {
  columns: string[]
  items: T[]
}) {

  return (
    <table className="w-full">
      <thead className="border-b border-black">
        <td className="font-bold">Title</td>
        <td className="font-bold">Price</td>
      </thead>
      <tbody>
        {/* {items.map(item => (
          <>
            <tr><td className="h-2" /></tr>
            <tr className="bg-slate-100 ">
              <td className="py-2 mb-2">{item.name}</td>
              <td className="py-2 mb-2">
                {item.displayPrice}/{item.priceUnit === 'per_hour' ? 'hour' : 'course'}
              </td>
            </tr>
            <tr><td className="h-2" /></tr>
          </>
        ))} */}
      </tbody>
    </table>
  )
}