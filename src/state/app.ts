import _ from 'radash'
import { atom, selector } from 'recoil'

export const subscribeModalOpenState = atom({
  key: 'subscribeModalOpenState',
  default: false
})

export const anyModalOpenState = selector({
  key: 'anyModalOpenState',
  get: ({ get }) => {
    if (get(subscribeModalOpenState)) return true
    return false
  }
})
