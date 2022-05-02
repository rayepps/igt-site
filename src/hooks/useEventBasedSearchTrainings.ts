import { useRecoilCallback, useRecoilValue } from 'recoil'
import api from 'src/api'
import { useQuery } from 'src/hooks'
import * as t from 'src/types'
import { eventSearchBasedTrainingHashSelector, eventSearchBasedTrainingOptionsSelector, eventSearchHashSelector, eventSearchOptionsState, eventSearchState, eventsState, trainingSearchState, trainingsState } from '../state/events'

/**
 * This functions like its neighboor useSearchEvents. See notes
 * there.
 */
export const useEventBasedSearchTrainings = ({
  onStart,
  onDone
}: {
  onStart?: () => void
  onDone?: () => void
} = {}) => {
  const hash = useRecoilValue(eventSearchBasedTrainingHashSelector)
  const searchTrainings = useQuery(`search.trainings.${hash}`, api.trainings.search)
  const options = useRecoilValue(eventSearchBasedTrainingOptionsSelector)
  const setSearchResults = useRecoilCallback(({ set, snapshot }) => async (data: { total: number; trainings: t.Training[] }) => {
    for (const training of data.trainings) {
      set(trainingsState(training.id), training)
    }
    const currentHash = await snapshot.getPromise(eventSearchBasedTrainingHashSelector)
    if (currentHash !== hash) {
      return
    }
    set(trainingSearchState, {
      total: data.total,
      results: data.trainings.map(t => t.id)
    })
  })

  const fetchAndStore = async () => {
    onStart?.()
    const { error, data } = await searchTrainings.query(options)
    onDone?.()
    if (error) {
      return { error, data }
    }
    await setSearchResults(data)
    return { error, data }
  }

  return {
    ...searchTrainings,
    fetch: fetchAndStore
  }
}
