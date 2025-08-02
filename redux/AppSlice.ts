import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface InitialState {
    mode: 'light' | 'dark';
}

const initialState: InitialState = {
    mode: 'light'
}


export const AppModeSlice = createSlice({
    name: "appmode",
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<{ mode: 'light' | 'dark' }>) => {
            state.mode = action.payload.mode;
            console.log("Mode changed to: ", action.payload.mode);
        },
        toogleMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark': 'light'
        }
    },
});

export default AppModeSlice.reducer


export const { setMode, toogleMode } = AppModeSlice.actions;
