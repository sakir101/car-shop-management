import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a proper type for the state
interface ItemDeletionState {
    code: string;
    type: string;
}

// Set the correct initial state
const initialState: ItemDeletionState = {
    code: "",
    type: ""
};

const itemDeletionSlice = createSlice({
    name: "itemDeletion",
    initialState,
    reducers: {
        setItemToDeleteConcern: (state, action: PayloadAction<ItemDeletionState>) => {
            state.code = action.payload.code;
            state.type = action.payload.type;
        },
        setItemToDeleteInspection: (state, action: PayloadAction<ItemDeletionState>) => {
            state.code = action.payload.code;
            state.type = action.payload.type;
        },
        setItemToDeleteService: (state, action: PayloadAction<ItemDeletionState>) => {
            state.code = action.payload.code;
            state.type = action.payload.type;
        },
        setItemToDeleteInspectionGroup: (state, action: PayloadAction<ItemDeletionState>) => {
            state.code = action.payload.code;
            state.type = action.payload.type;
        },
        setItemToDeleteInspectionItem: (state, action: PayloadAction<ItemDeletionState>) => {
            state.code = action.payload.code;
            state.type = action.payload.type;
        },
        clearItemToDelete: (state) => {
            state.code = "";
            state.type = "";
        }
    }
});

// Export actions
export const { setItemToDeleteConcern, setItemToDeleteInspection, setItemToDeleteService, setItemToDeleteInspectionGroup, setItemToDeleteInspectionItem, clearItemToDelete } = itemDeletionSlice.actions;

// Export reducer
export default itemDeletionSlice.reducer;
