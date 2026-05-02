import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface EstimateItem {
    code: string;
}

interface IItemShow {
    estimateState: EstimateItem;
}

const initialState: IItemShow = {
    estimateState: {
        code: ""
    },
};

const deleteEstimateSlice = createSlice({
    name: "deleteEstimate",
    initialState,
    reducers: {
        addEstimateItem: (state, action: PayloadAction<EstimateItem>) => {
            state.estimateState = {
                code: action.payload.code
            };
        },
        clearEstimateState: (state) => {
            state.estimateState = { code: "" };
        },
    },
});

export const { addEstimateItem, clearEstimateState } =
    deleteEstimateSlice.actions;

export default deleteEstimateSlice.reducer;
