import { useState } from 'react'
import type { ApiError, ApiResponse, Auth } from '@exobase/client-builder'

export type FetchFunc <TArgs, TResult> = (args: TArgs, auth?: Auth) => Promise<ApiResponse<TResult>>
export interface FetchState<TArgs, TResult> {
  loading: boolean
  data: null | TResult
  error: null | ApiError
  started: boolean
  complete: boolean
  pending: boolean
  success: boolean
  fetch: (args: TArgs, auth?: Auth) => Promise<ApiResponse<TResult>>
}

export const useFetch = <TArgs, TResult>(fetchFunc: FetchFunc<TArgs, TResult>): FetchState<TArgs, TResult> => {
  const [state, setState] = useState<FetchState<TArgs, TResult>>({
    loading: false,
    data: null,
    error: null,
    success: false,
    started: false,
    complete: false,
    pending: false,
    fetch: (() => new Promise(r => r({}))) as any
  })

  const fetch = async (args: TArgs, auth?: Auth): Promise<ApiResponse<TResult>> => {
    setState({ ...state, loading: true, started: true })
    const { error, data } = await fetchFunc(args, auth)
    if (error) {
      setState({
        ...state,
        error,
        loading: false,
        complete: true,
        started: true
      })
    } else {
      setState({
        ...state,
        error: null,
        data,
        success: true,
        loading: false,
        complete: true,
        started: true
      })
    }
    return { error, data }
  }

  return {
    ...state,
    fetch
  }
}

export default useFetch
