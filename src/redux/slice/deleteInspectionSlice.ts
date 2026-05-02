import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface InspectionItem {
  code: string;
  type: string;
}

interface IItemShow {
  inspectionState: InspectionItem;
}

const initialState: IItemShow = {
  inspectionState: {
    code: "",
    type: "",
  },
};

const deleteInspectionSlice = createSlice({
  name: "deleteInspection",
  initialState,
  reducers: {
    addInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
      state.inspectionState = {
        code: action.payload.code,
        type: action.payload.type,
      };
    },
    clearInspectionState: (state) => {
      state.inspectionState = { code: "", type: "" };
    },
  },
});

export const { addInspectionItem, clearInspectionState } =
  deleteInspectionSlice.actions;

export default deleteInspectionSlice.reducer;
