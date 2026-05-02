import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { setegid } from "process";

// Define types for service and inspection items
interface ConcernItem {
    concernCode: string;
    title: string;
    description: string;
}

interface ServiceItem {
    serviceCode: string;
    title: string;
    description: string;
    stage?: string;
}

interface InspectionItem {
    inspectionCode: string;
    title: string;
    description: string;
    stage?: string;
}

interface SearchRelatedService {
    parentCode: string;
    parentType: string;
    childType: string;
    childCode: string;
    childTitle: string;
    childDescription: string;
    stage: string;
}

interface SearchRelatedInspection {
    parentCode: string;
    parentType: string;
    childType: string;
    childCode: string;
    childTitle: string;
    childDescription: string;
    stage: string;
}

interface Authorization {
    id?: string
    authorizationMedium: string;
    amount: number;
    note?: string;
    customerId?: string;
    providerId?: string;
    authorizationStatus: string
    estimateCode?: string
}
interface estimateUpdate {
    status?: string;
    type: string;
}


// Define the state interface with arrays
interface IItemShow {
    estimateServiceState: ServiceItem[];
    estimateInspectionState: InspectionItem[];
    estimateConcernState: ConcernItem[];
    updateEstimateServiceState: ServiceItem;
    updateEstimateInspectionState: InspectionItem;
    updateEstimateConcernState: ConcernItem;
    searchRelatedInspection: SearchRelatedInspection[];
    searchRelatedService: SearchRelatedService[];
    authorization: Authorization;
    estimateStatusType: estimateUpdate;
    estimateType: string;
    estimateStatus: string;
    titleEstimate: string;
    authorizationEdit: boolean;
    authorizationAdd: boolean;
    authorizationDelete: boolean;
    authorizationId: string;
    authorizationIds: string[];
    allAuthorizedStatus: boolean;
    serviceUpdate: boolean;
    inspectionUpdate: boolean;
    concernUpdate: boolean;
    estimateStatusTypeUpdate: boolean;
    estimateServiceAdd: boolean;
    estimateInspectionAdd: boolean;
    estimateConcernAdd: boolean;

}

// Initialize the state with empty arrays
const initialState: IItemShow = {
    estimateServiceState: [],
    estimateInspectionState: [],
    estimateConcernState: [],
    updateEstimateServiceState: {
        serviceCode: "",
        title: "",
        description: ""
    },
    updateEstimateInspectionState: {
        inspectionCode: "",
        title: "",
        description: ""
    },
    updateEstimateConcernState: {
        concernCode: "",
        title: "",
        description: ""
    },
    searchRelatedInspection: [],
    searchRelatedService: [],
    authorization: {
        id: "",
        authorizationMedium: "",
        amount: 0,
        note: "",
        customerId: "",
        providerId: "",
        authorizationStatus: "Incomplete",
        estimateCode: ""
    },
    estimateStatusType: {
        type: "",
        status: ""
    },
    estimateType: "Estimate",
    estimateStatus: "Pending",
    titleEstimate: "",
    authorizationEdit: false,
    authorizationAdd: false,
    authorizationDelete: false,
    authorizationId: "",
    authorizationIds: [],
    allAuthorizedStatus: false,
    serviceUpdate: false,
    inspectionUpdate: false,
    concernUpdate: false,
    estimateStatusTypeUpdate: false,
    estimateServiceAdd: false,
    estimateInspectionAdd: false,
    estimateConcernAdd: false
};



// Create the slice
const estimateItemShowSlice = createSlice({
    name: "estimateItemShow",
    initialState,
    reducers: {
        // Add a new service item if it doesn't already exist
        addEstimateServiceItem: (state, action: PayloadAction<ServiceItem>) => {
            const exists = state.estimateServiceState.find(
                (item) => item.serviceCode === action.payload.serviceCode
            );
            if (!exists) {
                state.estimateServiceState.push(action.payload);
            }
        },
        addEstimateServiceItems: (state, action: PayloadAction<ServiceItem[]>) => {
            action.payload.forEach((newItem) => {
                const exists = state.estimateServiceState.some(
                    (item) => item.serviceCode === newItem.serviceCode
                );
                if (!exists) {
                    state.estimateServiceState.push(newItem);
                }
            });
            state.estimateServiceAdd = true
        },

        assignServiceHandleControllerForMultiple: (state, action) => {
            state.estimateServiceAdd = action.payload
        },
        // Add a new inspection item if it doesn't already exist
        addEstimateInspectionItem: (state, action: PayloadAction<InspectionItem>) => {
            const exists = state.estimateInspectionState.find(
                (item) => item.inspectionCode === action.payload.inspectionCode
            );
            if (!exists) {
                state.estimateInspectionState.push(action.payload);
            }
        },
        addEstimateInspectionItems: (state, action: PayloadAction<InspectionItem[]>) => {
            action.payload.forEach((newItem) => {
                const exists = state.estimateInspectionState.some(
                    (item) => item.inspectionCode === newItem.inspectionCode
                );
                if (!exists) {
                    state.estimateInspectionState.push(newItem);
                }
            });
            state.estimateInspectionAdd = true
        },

        assignInspectionHandleControllerForMultiple: (state, action) => {
            state.estimateInspectionAdd = action.payload
        },
        assignConcernHandleControllerForMultiple: (state, action) => {
            state.estimateConcernAdd = action.payload
        },
        addEstimateConcernItem: (state, action: PayloadAction<ConcernItem>) => {
            const exists = state.estimateConcernState.find(
                (item) => item.concernCode === action.payload.concernCode
            );
            if (!exists) {
                state.estimateConcernState.push(action.payload);
            }
        },
        updateEstimateServiceItem: (
            state,
            action: PayloadAction<{ serviceCode: string; title: string; description: string; }>
        ) => {
            const { serviceCode, title, description } = action.payload;

            const item = state.estimateServiceState.find(
                (item) => item.serviceCode === serviceCode
            );
            if (item) {
                item.title = title;
                item.description = description;
            }
        },
        updateEstimateInspectionItem: (
            state,
            action: PayloadAction<{ inspectionCode: string; title: string; description: string; }>
        ) => {
            const { inspectionCode, title, description } = action.payload;
            const item = state.estimateInspectionState.find(
                (item) => item.inspectionCode === inspectionCode
            );
            if (item) {
                item.title = title;
                item.description = description;
            }
        },
        updateEstimateConcernItem: (
            state,
            action: PayloadAction<{ concernCode: string; title: string; description: string; }>
        ) => {
            const { concernCode, title, description } = action.payload;
            const item = state.estimateConcernState.find(
                (item) => item.concernCode === concernCode
            );
            if (item) {
                item.title = title;
                item.description = description;
            }
        },
        // Remove a service item by its code
        removeEstimateServiceItem: (state, action: PayloadAction<string>) => {
            state.estimateServiceState = state.estimateServiceState.filter(
                (item) => item.serviceCode !== action.payload
            );
        },
        // Remove an inspection item by its code
        removeEstimateInspectionItem: (state, action: PayloadAction<string>) => {
            state.estimateInspectionState = state.estimateInspectionState.filter(
                (item) => item.inspectionCode !== action.payload
            );
        },
        removeEstimateConcernItem: (state, action: PayloadAction<string>) => {
            state.estimateConcernState = state.estimateConcernState.filter(
                (item) => item.concernCode !== action.payload
            );
        },
        removeAllEstimateInspectionItems: (state) => {
            state.estimateInspectionState = []
        },
        removeAllEstimateServiceItems: (state) => {
            state.estimateServiceState = []
        },
        removeAllEstimateConcernItems: (state) => {
            state.estimateConcernState = []
        },
        updateEstimateInspectionStage: (
            state,
            action: PayloadAction<{ index: number; stage: string }>
        ) => {
            const { index, stage } = action.payload;
            if (state.estimateInspectionState[index]) {
                state.estimateInspectionState[index].stage = stage;
            }
        },
        updateEstimateServiceStage: (
            state,
            action: PayloadAction<{ index: number; stage: string }>
        ) => {
            const { index, stage } = action.payload;
            if (state.estimateServiceState[index]) {
                state.estimateServiceState[index].stage = stage;
            }
        },
        addSearchRelatedInspection: (
            state,
            action: PayloadAction<SearchRelatedInspection>
        ) => {
            const exists = state.searchRelatedInspection.some(
                (item) =>
                    item.parentCode === action.payload.parentCode &&
                    item.childCode === action.payload.childCode
            );
            if (!exists) {
                state.searchRelatedInspection.push(action.payload);
            }
        },
        addSearchRelatedService: (
            state,
            action: PayloadAction<SearchRelatedService>
        ) => {
            const exists = state.searchRelatedService.some(
                (item) =>
                    item.parentCode === action.payload.parentCode &&
                    item.childCode === action.payload.childCode
            );
            if (!exists) {
                state.searchRelatedService.push(action.payload);
            }
        },
        updateSearchRelatedInspection: (
            state,
            action: PayloadAction<{ parentCode: string; childCode: string; stage: string }>
        ) => {
            const { parentCode, childCode, stage } = action.payload;
            const item = state.searchRelatedInspection.find(
                (item) => item.parentCode === parentCode && item.childCode === childCode
            );
            if (item) {
                item.stage = stage;
            }
        },
        updateSearchRelatedService: (
            state,
            action: PayloadAction<{ parentCode: string; childCode: string; stage: string }>
        ) => {
            const { parentCode, childCode, stage } = action.payload;
            const item = state.searchRelatedService.find(
                (item) => item.parentCode === parentCode && item.childCode === childCode
            );
            if (item) {
                item.stage = stage;
            }
        },
        removeSearchRelatedServiceInspection: (state) => {
          state.searchRelatedService = state.searchRelatedService.map(item => ({
            ...item,
            stage: "Accept",
          }));

          state.searchRelatedInspection = state.searchRelatedInspection.map(item => ({
            ...item,
            stage: "Accept",
          }));
        },

        setUpdateAuthorization: (
            state,
            action: PayloadAction<Authorization | "">
        ) => {
            if (action.payload === "") {
                // Reset to initial state
                state.authorization = {
                    id: '',
                    authorizationMedium: '',
                    amount: 0,
                    note: '',
                    authorizationStatus: '',
                };
            } else {
                state.authorization = {
                    authorizationMedium: action.payload.authorizationMedium,
                    amount: action.payload.amount,
                    note: action.payload.note,
                    customerId: action.payload.customerId,
                    providerId: action.payload.providerId,
                    authorizationStatus: action.payload.authorizationStatus,
                    estimateCode: action.payload.estimateCode
                };
            }
        },
        setSingleAuthorization: (
            state,
            action: PayloadAction<Authorization | "">
        ) => {
            if (action.payload === "") {
                // Reset to initial state
                state.authorization = {
                    id: '',
                    authorizationMedium: '',
                    amount: 0,
                    note: '',
                    authorizationStatus: '',
                };
            } else {
                state.authorization = {
                    id: action.payload.id,
                    authorizationMedium: action.payload.authorizationMedium,
                    amount: action.payload.amount,
                    note: action.payload.note,
                    customerId: action.payload.customerId,
                    providerId: action.payload.providerId,
                    authorizationStatus: action.payload.authorizationStatus,
                    estimateCode: action.payload.estimateCode
                };
            }
        },
        setAuthorizationEditStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.authorizationEdit = action.payload
        },
        setAuthorizationAddStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.authorizationAdd = action.payload
        },
        setAuthorizationDeleteStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.authorizationDelete = action.payload
        },
        setEstimateType: (state, action: PayloadAction<string>) => {
            state.estimateType = action.payload;
        },
        setEstimateStatus: (state, action: PayloadAction<string>) => {
            state.estimateStatus = action.payload;
        },
        setTitleEstimate: (state, action: PayloadAction<string>) => {

            state.titleEstimate = action.payload;
        },
        setAuthorizationId: (state, action: PayloadAction<string>) => {
            state.authorizationId = action.payload
        },
        setAuthorizationIds: (state, action: PayloadAction<string[]>) => {
            const newIds = action.payload;
            const uniqueIds = newIds.filter(id => !state.authorizationIds.includes(id));
            state.authorizationIds = [...state.authorizationIds, ...uniqueIds];
        },
        setAllAuthorizedStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.allAuthorizedStatus = action.payload
        },
        setEstimateServiceUpdateStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.serviceUpdate = action.payload
        },
        setEstimateInspectionUpdateStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.inspectionUpdate = action.payload
        },
        setEstimateConcernUpdateStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.concernUpdate = action.payload
        },
        setEstimateTypeStatusUpdate: (
            state,
            action: PayloadAction<estimateUpdate>
        ) => {
            state.estimateStatusType = action.payload
        },
        setEstimateStatusTypeUpdate: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.estimateStatusTypeUpdate = action.payload
        },
        updateEstimateServiceSingleItem: (
            state,
            action: PayloadAction<ServiceItem | "">
        ) => {
            if (action.payload === "") {
                // Reset to initial state
                state.updateEstimateServiceState = {
                    serviceCode: "",
                    title: "",
                    description: "",
                };
            } else {
                state.updateEstimateServiceState = {
                    serviceCode: action.payload.serviceCode,
                    title: action.payload.title,
                    description: action.payload.description,
                };
            }
        },
        updateEstimateInspectionSingleItem: (
            state,
            action: PayloadAction<InspectionItem | "">
        ) => {
            if (action.payload === "") {
                // Reset to initial state
                state.updateEstimateInspectionState = {
                    inspectionCode: "",
                    title: "",
                    description: "",
                };
            } else {
                state.updateEstimateInspectionState = {
                    inspectionCode: action.payload.inspectionCode,
                    title: action.payload.title,
                    description: action.payload.description,
                };
            }
        },
        updateEstimateConcernSingleItem: (
            state,
            action: PayloadAction<ConcernItem | "">
        ) => {
            if (action.payload === "") {
                // Reset to initial state
                state.updateEstimateConcernState = {
                    concernCode: "",
                    title: "",
                    description: "",
                };
            } else {
                state.updateEstimateConcernState = {
                    concernCode: action.payload.concernCode,
                    title: action.payload.title,
                    description: action.payload.description,
                };
            }
        },
        removeAllEstimateState: () => {
             return initialState; 
        },

    },
});

// Export actions and reducer
export const {
    addEstimateServiceItem,
    addEstimateInspectionItem,
    addEstimateConcernItem,
    removeEstimateServiceItem,
    removeEstimateInspectionItem,
    removeEstimateConcernItem,
    removeAllEstimateInspectionItems,
    removeAllEstimateServiceItems,
    removeAllEstimateConcernItems,
    updateEstimateServiceStage,
    updateEstimateInspectionStage,
    addSearchRelatedInspection,
    addSearchRelatedService,
    updateSearchRelatedInspection,
    updateSearchRelatedService,
    updateEstimateServiceItem,
    updateEstimateInspectionItem,
    updateEstimateConcernItem,
    setUpdateAuthorization,
    setEstimateType,
    setEstimateStatus,
    setTitleEstimate,
    setSingleAuthorization,
    setAuthorizationEditStatus,
    setEstimateStatusTypeUpdate,
    setAuthorizationAddStatus,
    setAuthorizationDeleteStatus,
    setAuthorizationId,
    setAuthorizationIds,
    setAllAuthorizedStatus,
    setEstimateConcernUpdateStatus,
    setEstimateInspectionUpdateStatus,
    setEstimateServiceUpdateStatus,
    setEstimateTypeStatusUpdate,
    updateEstimateConcernSingleItem,
    updateEstimateServiceSingleItem,
    updateEstimateInspectionSingleItem,
    addEstimateServiceItems,
    addEstimateInspectionItems,
    assignServiceHandleControllerForMultiple,
    assignInspectionHandleControllerForMultiple,
    assignConcernHandleControllerForMultiple,
    removeAllEstimateState,
    removeSearchRelatedServiceInspection
    
    
} = estimateItemShowSlice.actions;

export default estimateItemShowSlice.reducer;
