import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define types for service and inspection items
interface ServiceItem {
    serviceCode: string;
    title: string;
    type: string;
}
interface generalItem {
    generalCode: string;
    name: string;
    type: string;
}
interface tireItem {
    tireCode: string;
    name: string;
    type: string;
}

interface InspectionItem {
    inspectionCode: string;
    title: string;
    type: string;
}

// Define the state interface with arrays
interface IItemShow {
    serviceState: ServiceItem[];
    inspectionState: InspectionItem[];
    inspectionGeneralItemState: generalItem[]
    inspectiontireItemState: tireItem[]
    serviceHandle: boolean
    concernHandle: boolean
    inspectionHandle: boolean
    inspectionGeneralHandle: boolean
    inspectionTireHandle: boolean
}

// Initialize the state with empty arrays
const initialState: IItemShow = {
    serviceState: [],
    inspectionGeneralItemState: [],
    inspectiontireItemState: [],
    inspectionState: [],
    serviceHandle: false,
    concernHandle: false,
    inspectionHandle: false,
    inspectionGeneralHandle: false,
    inspectionTireHandle: false
};

// Create the slice
const searchItemShowSlice = createSlice({
    name: "searchItemShow",
    initialState,
    reducers: {
        // Add a new service item if it doesn't already exist
        addServiceItem: (state, action: PayloadAction<ServiceItem>) => {
            const exists = state.serviceState.find(
                (item) => item.serviceCode === action.payload.serviceCode
            );
            if (!exists) {
                state.serviceState.push(action.payload);
            }
        },
        addInspectionGeneralItem: (state, action: PayloadAction<generalItem>) => {
            const exists = state.inspectionGeneralItemState.find(
                (item) => item.generalCode === action.payload.generalCode
            );
            if (!exists) {
                state.inspectionGeneralItemState.push(action.payload);
            }
        },
        addInspectionTireItem: (state, action: PayloadAction<tireItem>) => {
            const exists = state.inspectiontireItemState.find(
                (item) => item.tireCode === action.payload.tireCode
            );
            if (!exists) {
                state.inspectiontireItemState.push(action.payload);
            }
        },
        addServiceItems: (state, action: PayloadAction<ServiceItem[]>) => {
            state.serviceState.push(...action.payload)
        },



        // Add a new inspection item if it doesn't already exist
        addInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
            const exists = state.inspectionState.find(
                (item) => item.inspectionCode === action.payload.inspectionCode
            );
            if (!exists) {
                state.inspectionState.push(action.payload);
            }
        },
        // Remove a service item by its code
        removeServiceItem: (state, action: PayloadAction<string>) => {
            state.serviceState = state.serviceState.filter(
                (item) => item.serviceCode !== action.payload
            );
        },
        // Remove an inspection item by its code
        removeInspectionItem: (state, action: PayloadAction<string>) => {
            state.inspectionState = state.inspectionState.filter(
                (item) => item.inspectionCode !== action.payload
            );
        },
        removeInspectionGeneralItem: (state, action: PayloadAction<string>) => {
            state.inspectionGeneralItemState = state.inspectionGeneralItemState.filter(
                (item) => item.generalCode !== action.payload
            );
        },
        removeInspectionTireItem: (state, action: PayloadAction<string>) => {
            state.inspectiontireItemState = state.inspectiontireItemState.filter(
                (item) => item.tireCode !== action.payload
            );
        },
        removeAllInspectionItems: (state) => {
            state.inspectionState = []
        },
        removeAllServiceItems: (state) => {
            state.serviceState = []
        },
        removeAllInspectionGeneralItems: (state) => {
            state.inspectionGeneralItemState = []
        },
        removeAllInspectionTireItems: (state) => {
            state.inspectiontireItemState = []
        },

        // updateInspectionType: (
        //     state,
        //     action: PayloadAction<{ index: number; type: string }>
        // ) => {
        //     const { index, type } = action.payload;
        //     if (state.inspectionState[index]) {
        //         state.inspectionState[index].type = type;
        //     }
        // },

        // updateServiceType: (
        //     state,
        //     action: PayloadAction<{ code: string; type: string }>
        // ) => {
        //     const { code, type } = action.payload;
        //     if (state.serviceState[code]) {
        //         state.serviceState[code].type = type;
        //     }
        // },
        updateInspectionType: (
            state,
            action: PayloadAction<{ code: string; type: string }>
          ) => {
            const { code, type } = action.payload;
            const inspection = state.inspectionState.find(item => item.inspectionCode === code);
            if (inspection) {
              inspection.type = type;
            }
          },
          updateServiceType: (
            state,
            action: PayloadAction<{ code: string; type: string }>
          ) => {
            const { code, type } = action.payload;
            const service = state.serviceState.find(item => item.serviceCode === code);
            if (service) {
              service.type = type;
            }
          },

        assignServiceHandleController: (state, action: PayloadAction<boolean>) => {
            state.serviceHandle = action.payload
        },
        assignInspectionGeneralHandleController: (state, action: PayloadAction<boolean>) => {
            state.inspectionGeneralHandle = action.payload
        },
        assignInspectiontireHandleController: (state, action: PayloadAction<boolean>) => {
            state.inspectionTireHandle = action.payload
        },

        assignConcernHandleController: (state, action: PayloadAction<boolean>) => {
            state.concernHandle = action.payload
        },

        assignInspectionHandleController: (state, action: PayloadAction<boolean>) => {
            state.inspectionHandle = action.payload
        },

        removeServiceHandleController: (state) => {
            state.inspectionHandle = false
        },

        removeSearchItemShow: (state) => {
            state.inspectionState = []
            state.serviceState = []
            state.inspectionGeneralItemState = []
            state.inspectiontireItemState = []
            state.serviceHandle = false
            state.concernHandle = false
            state.inspectionHandle = false
            state.inspectionGeneralHandle = false
            state.inspectionTireHandle = false
        },

    },
});

// Export actions and reducer
export const {
    addServiceItem,
    addInspectionItem,
    removeServiceItem,
    removeInspectionItem,
    removeAllInspectionItems,
    removeAllServiceItems,
    updateServiceType,
    updateInspectionType,
    assignServiceHandleController,
    assignConcernHandleController,
    assignInspectionHandleController,
    addServiceItems,
    removeServiceHandleController,
    addInspectionGeneralItem,
    addInspectionTireItem,
    assignInspectionGeneralHandleController,
    assignInspectiontireHandleController,
    removeInspectionGeneralItem,
    removeInspectionTireItem,
    removeAllInspectionTireItems,
    removeAllInspectionGeneralItems,
    removeSearchItemShow

} = searchItemShowSlice.actions;

export default searchItemShowSlice.reducer;
