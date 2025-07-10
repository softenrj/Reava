import { IMusic } from "@/types/music";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IMusic[] = [];

const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {
        setMusic(state, action: PayloadAction<IMusic[]>) {
            return action.payload;
        },
        addMusic(state, action: PayloadAction<IMusic>) {
            state.push(action.payload);
        },
        removeMusic(state, action: PayloadAction<string>) {
            return state.filter((item) => item?._id !== action.payload);
        },
        updateMusic(state, action: PayloadAction<IMusic>) {
            return state.map(item =>
                item._id === action.payload._id ? action.payload : item
            );
        }
    }
});

export const { setMusic, addMusic, removeMusic, updateMusic } = musicSlice.actions;
export default musicSlice.reducer;
