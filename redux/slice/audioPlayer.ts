import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    isPlaying: false,
    isMuted: false,
    loop: false,
}
const audioSlice = createSlice({
    name: 'audio',
    initialState,
    reducers: {
        setIsPlaying(state, action: PayloadAction<boolean>) {
            state.isPlaying = action.payload
        },
        setIsMuted(state, action: PayloadAction<boolean>) {
            state.isMuted = action.payload
        },
        setLoop(state, action: PayloadAction<boolean>) {
            state.loop = action.payload
        },
    }
})

export const { setIsPlaying, setIsMuted, setLoop } = audioSlice.actions
export default audioSlice.reducer;