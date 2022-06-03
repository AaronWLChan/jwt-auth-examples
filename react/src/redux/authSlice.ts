import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 

interface AuthState {
    accessToken?: string
}

const INITIAL_STATE: AuthState = {}

const authSlice = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload
        },

    }
})

export const { setAccessToken } = authSlice.actions

export default authSlice.reducer
