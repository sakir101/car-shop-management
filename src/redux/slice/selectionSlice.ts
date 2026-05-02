import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SelectionState {
    selectedTypes: Record<string, string>;
    selectedStages: Record<string, string>;
    checkboxStates: Record<string, boolean>;
    radioStates: Record<string, string | null>;
}

const initialState: SelectionState = {
    selectedTypes: {},
    selectedStages: {},
    checkboxStates: {},
    radioStates: {},
};

const selectionSlice = createSlice({
    name: "selection",
    initialState,
    reducers: {
        setSelectedType: (
            state,
            action: PayloadAction<{ code: string; type: string }>
        ) => {
            const { code, type } = action.payload;
            state.selectedTypes[code] = type;
        },
        setSelectedStage: (
            state,
            action: PayloadAction<{ code: string; stage: string }>
        ) => {
            const { code, stage } = action.payload;
            state.selectedStages[code] = stage;
        },
        setCheckboxState: (
            state,
            action: PayloadAction<{ code: string; checked: boolean }>
        ) => {
            const { code, checked } = action.payload;
            state.checkboxStates[code] = checked;
        },
        setRadioState: (
            state,
            action: PayloadAction<{ code: string; value: string | null}>
        ) => {
            const { code, value } = action.payload;
            state.radioStates[code] = value;
        },
       initializeRadioStates: (
           state,
           action: PayloadAction<{ codes: string[]; radioState: string}>
         ) => {
           const { codes, radioState } = action.payload;
           codes.forEach((code) => {
             if (!state.radioStates[code]) {
                 state.radioStates[code] = radioState
             }
           });
         },

    initializeSelectedTypes: (
      state,
      action: PayloadAction<{ items: { code: string }[]; radioState: string }>
    ) => {
      const { items, radioState } = action.payload;
      items.forEach((item) => {
        if (!state.selectedTypes[item.code]) {
            state.selectedTypes[item.code] = radioState;
        }
      });
    },
    initializeSelectedStage: (
      state,
      action: PayloadAction<{ items: { code: string }[]; radioState: string }>
    ) => {
      const { items, radioState } = action.payload;
      items.forEach((item) => {
        if (!state.selectedStages[item.code]) {
            state.selectedStages[item.code] = radioState;
        }
      });
    },
        clearAllSelection: (state) => {
            state.selectedTypes = {};
            state.selectedStages = {};
            state.checkboxStates = {};
            state.radioStates = {};
        },
        clearCheckboxState:(state)=>{
          state.checkboxStates = {};
        }
    },
});

export const {
    setSelectedType,
    setSelectedStage,
    setCheckboxState,
    setRadioState,
    clearAllSelection,
    initializeRadioStates,
    initializeSelectedTypes,
    initializeSelectedStage,
    clearCheckboxState
} = selectionSlice.actions;

export default selectionSlice.reducer;
