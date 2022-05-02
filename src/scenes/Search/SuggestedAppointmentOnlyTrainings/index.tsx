import _ from 'radash'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import TrainingGrid from 'src/components/TrainingGrid'
import { useEventBasedSearchTrainings } from 'src/hooks/useEventBasedSearchTrainings'
import { eventSearchBasedTrainingHashSelector } from 'src/state/events'
import * as t from 'src/types'

export default function SuggestedAppointmentOnlyTrainings({
  onTrainingClick
}: {
  onTrainingClick?: (training: t.Training) => void
}) {
  const searchTrainings = useEventBasedSearchTrainings()
  const hash = useRecoilValue(eventSearchBasedTrainingHashSelector)

  useEffect(() => {
    searchTrainings.fetch()
  }, [hash])

  const trainings = searchTrainings.loading ? [] : searchTrainings.data?.trainings?.slice(0, 8) ?? []

  // Rare case where if there are no results or even if its
  // still loading we won't render. This is because the use
  // case for this specific component is to sit under the
  // event results and 'suggest' appointment only trainings
  // that match. If there are none we should show nothing,
  // not even the <h4> and <p>.
  if (trainings.length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="text-4xl font-bold pb-2">Appointment Only</h4>
      <p className="text-xl max-w-prose">
        These trainings match your filters but do not have set event dates. They do offer courses by appointments. Call or email to start training.
      </p>
      <div className="mt-10">
        <TrainingGrid trainings={trainings} onTrainingClick={onTrainingClick} />
      </div>
    </div>
  )
}
