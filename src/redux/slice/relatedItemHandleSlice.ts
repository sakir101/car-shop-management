import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
    handleDeleteItemDB: { code: string, type: string; subType: string };
    handleUpdateTypeDB: { code: string, category: string; type: string; subType: string };
}

const initialState: SelectionState = {
    handleDeleteItemDB: {
        code: "",
        type: "",
        subType: "",
    },
    handleUpdateTypeDB: {
        code: "",
        category: "",
        type: "",
        subType: "",
    },
};

const selectionSlice = createSlice({
    name: "relatedItemHandleDB",
    initialState,
    reducers: {
        setDeleteItemDB: (
            state,
            action: PayloadAction<{ code: string; type: string; subType: string }>
        ) => {
            const { code, type, subType } = action.payload;
            state.handleDeleteItemDB.code = code;
            state.handleDeleteItemDB.type = type;
            state.handleDeleteItemDB.subType = subType;
        },
        setUpdateItemDB: (
            state,
            action: PayloadAction<{
                code: string;
                category: string;
                type: string;
                subType: string;
            }>
        ) => {
            const { code, category, type, subType } = action.payload;
            state.handleUpdateTypeDB.code = code;
            state.handleUpdateTypeDB.category = category;
            state.handleUpdateTypeDB.type = type;
            state.handleUpdateTypeDB.subType = subType;

        },
        clearAllRelatedItemDB: (state) => {
            state.handleDeleteItemDB = {
                code: "",
                type: "",
                subType: "",
            };
            state.handleUpdateTypeDB = {
                code: "",
                category: "",
                type: "",
                subType: "",
            };
        },
        removeAllRelatedItemSlice: () => {
            return initialState;
        },
    },
});

export const {
    setDeleteItemDB,
    setUpdateItemDB,
    clearAllRelatedItemDB,
    removeAllRelatedItemSlice,
} = selectionSlice.actions;

export default selectionSlice.reducer;
