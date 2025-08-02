import { configureStore } from '@reduxjs/toolkit'
import { AppModeSlice } from './AppSlice'
// ...

export const store = configureStore({
  reducer: {
    appmode: AppModeSlice.reducer
  }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store