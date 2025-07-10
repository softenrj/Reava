import { configureStore } from '@reduxjs/toolkit'
import audioSlice from './slice/audioPlayer'
import muiscSlice from './slice/music'
import playList from './slice/playlist'
import profileSlice from './slice/profile'

export const store = configureStore({
  reducer: {
    muiscSlice,
    profileSlice,
    playList,
    audioSlice
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch