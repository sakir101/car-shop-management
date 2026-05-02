import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LaborItem {
  id: number;
}

interface LItemShow {
  LaborState: LaborItem;
}

const initialState: LItemShow = {
  LaborState: {
    id: 0,
  },
};

const deleteLaborSlice = createSlice({
  name: "deleteLabor",
  initialState,
  reducers: {
    addLaborItem: (state, action: PayloadAction<LaborItem>) => {
      state.LaborState = action.payload;
    },

    clearLaborState: (state) => {
      state.LaborState = { id: 0 };
    },
  },
});

export const { addLaborItem, clearLaborState } = deleteLaborSlice.actions;

export default deleteLaborSlice.reducer;
