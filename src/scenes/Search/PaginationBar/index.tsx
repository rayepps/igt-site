import { Pagination } from 'evergreen-ui'
import Recoil from 'recoil'
import { eventSearchOptionsState, eventSearchState } from 'src/state/events'

export default function PaginationBar() {
  const [options, setOptions] = Recoil.useRecoilState(eventSearchOptionsState)
  const { total } = Recoil.useRecoilValue(eventSearchState)
  const { page, pageSize } = options
  if (!page || !pageSize || total === 0) return null
  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize)
  const onNext = () => {
    setOptions({
      ...options,
      page: page + 1,
      pageSize
    })
  }
  const onPrevious = () => {
    setOptions({
      ...options,
      page: page - 1,
      pageSize
    })
  }
  const onChange = (newPage: number) => {
    setOptions({
      ...options,
      page: newPage,
      pageSize
    })
  }
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <Pagination
        page={page}
        totalPages={totalPages}
        onNextPage={onNext}
        onPreviousPage={onPrevious}
        onPageChange={onChange}
      />
    </div>
  )
}
