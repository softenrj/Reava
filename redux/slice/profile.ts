import { User } from "@/types/profile";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Partial<User> = {}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<User>) {
            return action.payload;
        },
        updateUser(state, action: PayloadAction<User>) {
            return action.payload
        }
    }
})

export default userSlice.reducer;
export const { setUser, updateUser } = userSlice.actions;