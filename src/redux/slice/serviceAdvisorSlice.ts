import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define the inner structure for serviceGeneralTire
export interface IServiceGeneralTire {
    id: string;
    type: string;
}

// Define the slice state structure
interface IServiceGeneralTireState {
    serviceGeneralTire: IServiceGeneralTire;
}

// Initial state
const initialState: IServiceGeneralTireState = {
    serviceGeneralTire: {
        id: "",
        type: ""
    }
};

// Slice definition
const serviceItemAssignSlice = createSlice({
    name: "serviceItemAssign",
    initialState,
    reducers: {
        setServiceGeneralTire: (state, action: PayloadAction<IServiceGeneralTire>) => {
            state.serviceGeneralTire = action.payload;
        }
    }
});

// Export action
export const { setServiceGeneralTire } = serviceItemAssignSlice.actions;

// Export reducer
export default serviceItemAssignSlice.reducer;
