

import { useRecoilState } from 'recoil'
import { storeState } from 'src/state/store'
import type { DataStoreState } from 'src/state/store'
import type { ApiResponse, Auth } from '@exobase/client-builder'

export type FetchFunc <TArgs, TResult> = (args: TArgs, auth?: Auth) => Promise<ApiResponse<TResult>>

export const useQuery = <TArgs, TResult> (key: string, func: FetchFunc<TArgs, TResult>) => {
  const [store, setStore] = useRecoilState(storeState(`query.${key}`))
  const query = async (args: TArgs = {} as TArgs, auth: Auth = {} as Auth): Promise<ApiResponse<TResult>> => {
    if (store.success) {
      return { error: null, data: store.data }
    }
    setStore((s) => ({ ...s, loading: true, started: true }))
    const { error, data } = await func(args, auth)
    if (error) {
      setStore((s) => ({
        ...s,
        error,
        loading: false,
        complete: true,
        started: true
      }))
    } else {
      setStore((s) => ({
        ...s,
        error: null,
        data,
        success: true,
        loading: false,
        complete: true,
        started: true
      }))
    }
    return { error, data }
  }
  const invalidate = () => {
    // TODO: This
  }
  return {
    ...store,
    query,
    invalidate
  } as DataStoreState<TResult> & { query: typeof query; invalidate: typeof invalidate }
}

export default useQuery
