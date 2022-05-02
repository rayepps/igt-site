import _ from 'radash'
import { atom, atomFamily, selector } from 'recoil'
import * as t from '../types'
import type { ApiError, ApiResponse, Auth } from '@exobase/client-builder'


export interface DataStoreState <TData> {
  loading: boolean
  data: null | TData
  error: null | ApiError
  started: boolean
  complete: boolean
  pending: boolean
  success: boolean
}

export const storeState = atomFamily({
  key: 'px.data-store',
  default: {
    loading: false,
    data: null,
    error: null,
    success: false,
    started: false,
    complete: false,
    pending: false
  } as DataStoreState<any>
})
