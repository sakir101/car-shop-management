import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISReset {
    isReset: boolean; // Keeping the name as `isRestet`
}

const initialState: ISReset = {
    isReset: false // Keeping the name as `isRestet`
};

const ResetSlice = createSlice({
    name: 'reset',
    initialState,
    reducers: {
        setResetStatus: (state, action: PayloadAction<boolean>) => {
            state.isReset = action.payload; // Keeping the name as `isRestet`
        },
        clearResetStatus: (state) => {
            state.isReset = false; // Keeping the name as `isRestet`
        },
    }
});

export const { setResetStatus, clearResetStatus } = ResetSlice.actions;

export default ResetSlice.reducer;