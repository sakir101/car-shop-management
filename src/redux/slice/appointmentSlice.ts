import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define types for service and inspection items
interface ServiceItem {
    serviceCode: string;
    title: string;
}
interface EstimateItem {
    estimateCode: string;
    title: string;
    status:string;
}

interface ContactItem {
    userId: string;
    name: string;
    contactNum: string;
    code?:string;
}

// Define the state interface with arrays
interface IItemShow {
    serviceState: ServiceItem[];
    contactState: ContactItem[];
    estimateState: EstimateItem[];
    estimateCode: string
}

// Initialize the state with empty arrays
const initialState: IItemShow = {
    serviceState: [],
    contactState: [],
    estimateState: [],
    estimateCode: ""
};

// Create the slice
const appointmentItemShowSlice = createSlice({
    name: "appointmentShow",
    initialState,
    reducers: {
        // Add a new service item if it doesn't already exist
        addServiceAppointment: (state, action: PayloadAction<ServiceItem>) => {
            const exists = state.serviceState.find(
                (item) => item.serviceCode === action.payload.serviceCode
            );
            if (!exists) {
                state.serviceState.push(action.payload);
            }
        },
        addEstimateAppointment: (state, action: PayloadAction<EstimateItem>) => {
           
            const exists = state.estimateState.find(
                (item) => item.estimateCode === action.payload.estimateCode
            );
            if (!exists) {
                state.estimateState.push(action.payload);
            }
        },
        addContactAppointment: (state, action: PayloadAction<ContactItem>) => {
            const exists = state.contactState.find(
                (item) => item.userId === action.payload.userId
            );
            if (!exists) {
                state.contactState.push(action.payload);
            }
        },
        addEstimateCode: (state, action: PayloadAction<string>) => {
            state.estimateCode = action.payload;
        },
        removeServiceAppointment: (state, action: PayloadAction<string>) => {
            state.serviceState = state.serviceState.filter(
                (item) => item.serviceCode !== action.payload
            );
        },
        removeEstimateAppointment: (state, action: PayloadAction<string>) => {
            state.estimateState = state.estimateState.filter(
                (item) => item.estimateCode !== action.payload
            );
        },
        // Remove an inspection item by its code
        removeContactAppointment: (state, action: PayloadAction<string>) => {
            state.contactState = state.contactState.filter(
                (item) => item.userId !== action.payload
            );
        },
        removeEstimateCode: (state) => {
            state.estimateCode = ""
        },
        removeAllServiceAppointment: (state) => {
            state.serviceState = []
        },
        removeAllEstimateAppointment: (state) => {
            state.estimateState = []
        },
        removeAllContactAppointment: (state) => {
            state.contactState = []
        },
        removeAllAppointmentState: () => {
             return initialState; 
        },
    },
});

// Export actions and reducer
export const {
    addServiceAppointment,
    addContactAppointment,
    removeServiceAppointment,
    removeContactAppointment,
    removeAllServiceAppointment,
    removeAllContactAppointment,
    addEstimateAppointment,
    removeAllEstimateAppointment,
    removeEstimateAppointment,
    addEstimateCode,
    removeEstimateCode,
    removeAllAppointmentState
} = appointmentItemShowSlice.actions;

export default appointmentItemShowSlice.reducer;
