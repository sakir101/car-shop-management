import { calculateTotalAmount } from "@/utils/amount";
import { calculateInspectionTotalHours, calculateLabourTotalHours, calculateTempInspectionTotalHours, calculateTempLabourTotalHours, calculateTempTotalHours, calculateTotalHours } from "@/utils/total-hour-calculate";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define types for service and inspection items
export interface Part {
    serviceCode?: string;
    serviceStage?: string;
    partId?: string;
    name: string;
    unitPrice: number;
    provider: string;
    installationHours: number;
    quantity: number
    total:number;
    margin:number

}

export interface Labour {
    serviceCode?: string;
    serviceStage?: string;
    labourId?: string;
    name: string;
    ratePerHour: number;
    requiredHours: number;
}

export interface MechanicPercentage {
    serviceCode?: string;
    serviceStage?: string;
    mechanicPercentageId?: string;
    id: string;
    name: string;
    percentage: string;
}

export interface ModifiedMechanicPercentage {
    serviceCode?: string;
    serviceStage?: string;
    mechanicPercentageId?: string;
    id: string;
    name: string;
    percentage?: string
}

export interface InspectionHour {
    inspectionCode?: string;
    inspectionStage?: string;
    inspectionHourId?: string;
    inspectionHours: number;
    inspectionHourlyRate: number;
}

export interface InspectionPercentage {
    inspectorId: string;
    inspectionCode?: string;
    inspectionStage?: string;
    inspectionPercentageId?: string;
    id: string;
    name: string;
    percentage: string
}

export interface ModifiedInspectionPercentage {
    inspectionCode?: string;
    inspectionStage?: string;
    inspectionPercentageId?: string;
    id: string;
    name: string;
    percentage?: string
}

export interface EstimateTechnician {
    id: string;
    name: string;
}



// Define the state interface with arrays
export interface IItemShow {
    part: Part[];
    changePart: Part;
    tempPart: Part[];
    deferredPart: Part[];
    changeDeferredPart: Part;
    tempDeferredPart: Part[];
    labour: Labour[];
    changeLabour: Labour;
    tempLabour: Labour[];
    deferredLabour: Labour[];
    changeDeferredLabour: Labour;
    tempDeferredLabour: Labour[];
    mechanicPercentage: MechanicPercentage[];
    changeMechanicPercentage: ModifiedMechanicPercentage;
    tempMechanicPercentage: MechanicPercentage[];
    deferredMechanicPercentage: MechanicPercentage[];
    changeDeferredMechanicPercentage: ModifiedMechanicPercentage;
    tempDeferredMechanicPercentage: MechanicPercentage[];
    estimateTechnician: EstimateTechnician[];
    inspectionHour: InspectionHour[];
    changeInspectionHour: InspectionHour;
    tempInspectionHour: InspectionHour[];
    deferredInspectionHour: InspectionHour[];
    changeDeferredInspectionHour: InspectionHour;
    tempDeferredInspectionHour: InspectionHour[];
    inspectionPercentage: InspectionPercentage[]
    changeInspectionPercentage: ModifiedInspectionPercentage;
    tempInspectionPercentage: InspectionPercentage[];
    deferredInspectionPercentage: InspectionPercentage[];
    changeDeferredInspectionPercentage: ModifiedInspectionPercentage;
    tempDeferredInspectionPercentage: InspectionPercentage[];
    partsTotalAmount: number,
    tempPartsTotalAmount: number,
    labourTotalAmount: number,
    tempLabourTotalAmount: number,
    inspectionTotalAmount: number,
    tempInspectionTotalAmount: number,
    inspectionTotalHours: string,
    tempInspectionTotalHours: string,
    labourTotalHours: string,
    tempLabourTotalHours: string,
    totalAmount: number,
    tempTotalAmount: number,
    totalHours: string,
    tempTotalHours: string,
    updateStatusInspectionHour: boolean,
    deleteStatusInspectionHour: boolean,
    updateStatusMechanicPercentage: boolean,
    deleteStatusMechanicPercentage: boolean,
    updateStatusInspectionPercentage: boolean,
    deleteStatusInspectionPercentage: boolean,
    updateStatusPart: boolean,
    deleteStatusPart: boolean,
    updateStatusLabour: boolean,
    deleteStatusLabour: boolean,
    newInsertInspectionHour: boolean,
    newInsertMechanicPercentage: boolean,
    newInsertInspectionPercentage: boolean,
    newInsertPart: boolean,
    newInsertLabour: boolean,
    updateEstimateTechnicianStatus: boolean
}

// Initialize the state with empty arrays
const initialState: IItemShow = {
    part: [],
    tempPart: [],
    changePart: {
        serviceCode: "",
        partId: "",
        name: "",
        unitPrice: 0,
        provider: "",
        installationHours: 0,
        quantity: 0,
        total: 0,
        margin: 0
    },
    deferredPart: [],
    changeDeferredPart: {
        serviceCode: "",
        partId: "",
        name: "",
        unitPrice: 0,
        provider: "",
        installationHours: 0,
        quantity: 0,
        total: 0,
        margin: 0
    },
    tempDeferredPart: [],
    labour: [],
    changeLabour: {
        serviceCode: "",
        labourId: "",
        name: "",
        ratePerHour: 0,
        requiredHours: 0
    },
    tempLabour: [],
    deferredLabour: [],
    changeDeferredLabour: {
        serviceCode: "",
        labourId: "",
        name: "",
        ratePerHour: 0,
        requiredHours: 0
    },
    tempDeferredLabour: [],
    mechanicPercentage: [],
    tempMechanicPercentage: [],
    estimateTechnician: [],
    changeMechanicPercentage: {
        serviceCode: "",
        mechanicPercentageId: "",
        id: "",
        name: "",
        percentage: ""
    },
    deferredMechanicPercentage: [],
    tempDeferredMechanicPercentage: [],
    changeDeferredMechanicPercentage: {
        serviceCode: "",
        mechanicPercentageId: "",
        id: "",
        name: "",
        percentage: ""
    },
    inspectionPercentage: [],
    tempInspectionPercentage: [],
    changeInspectionPercentage: {
        inspectionCode: "",
        inspectionPercentageId: "",
        id: "",
        name: "",
        percentage: ""
    },
    deferredInspectionPercentage: [],
    changeDeferredInspectionPercentage: {
        inspectionCode: "",
        inspectionPercentageId: "",
        id: "",
        name: "",
        percentage: ""
    },
    tempDeferredInspectionPercentage: [],
    inspectionHour: [],
    tempInspectionHour: [],
    changeInspectionHour: {
        inspectionCode: "",
        inspectionHourId: "",
        inspectionHours: 0,
        inspectionHourlyRate: 0
    },

    deferredInspectionHour: [],
    changeDeferredInspectionHour: {
        inspectionCode: "",
        inspectionHourId: "",
        inspectionHours: 0,
        inspectionHourlyRate: 0
    },
    tempDeferredInspectionHour: [],
    partsTotalAmount: 0,
    tempPartsTotalAmount: 0,
    labourTotalAmount: 0,
    tempLabourTotalAmount: 0,
    inspectionTotalAmount: 0,
    tempInspectionTotalAmount: 0,
    inspectionTotalHours: "00:00",
    tempInspectionTotalHours: "00:00",
    labourTotalHours: "00:00",
    tempLabourTotalHours: "00:00",
    totalAmount: 0,
    tempTotalAmount: 0,
    totalHours: "00:00",
    tempTotalHours: "00:00",
    updateStatusInspectionHour: false,
    deleteStatusInspectionHour: false,
    updateStatusMechanicPercentage: false,
    deleteStatusMechanicPercentage: false,
    updateStatusInspectionPercentage: false,
    deleteStatusInspectionPercentage: false,
    updateStatusPart: false,
    deleteStatusPart: false,
    updateStatusLabour: false,
    deleteStatusLabour: false,
    newInsertInspectionHour: false,
    newInsertMechanicPercentage: false,
    newInsertInspectionPercentage: false,
    newInsertPart: false,
    newInsertLabour: false,
    updateEstimateTechnicianStatus: false
};

// Create the slice
const serviceInspectionItemSlice = createSlice({
    name: "serviceInspectionItem",
    initialState,
    reducers: {
        addPart: (state, action: PayloadAction<Part>) => {
            state.part.push(action.payload);
            const amount = Number((action.payload.total ).toFixed(2));
            state.partsTotalAmount = Number((state.partsTotalAmount + amount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + amount).toFixed(2));
            state.totalHours = calculateTotalHours(state);
        },
        addDeferredPart: (state, action: PayloadAction<Part>) => {
            state.deferredPart.push(action.payload);
        },
        addParts: (state, action: PayloadAction<Part[]>) => {
            state.part.push(...action.payload);
            const totalAmount = action.payload.reduce((sum, part) => {
                return sum + Number((part?.total)?.toFixed(2));
            }, 0);
            state.partsTotalAmount = Number((state.partsTotalAmount + totalAmount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + totalAmount).toFixed(2));
            state.totalHours = calculateTotalHours(state);

        },
        addDeferredParts: (state, action: PayloadAction<Part[]>) => {
            state.deferredPart.push(...action.payload);
        },
        addChangePart: (state, action: PayloadAction<Part>) => {
            state.changePart = action.payload;
        },
        addChangeDeferredPart: (state, action: PayloadAction<Part>) => {
            state.changeDeferredPart = action.payload;
        },
        addTempPart: (state, action: PayloadAction<Part>) => {
            state.tempPart.push(action.payload);
            state.tempPartsTotalAmount = Number((state.tempPartsTotalAmount + action.payload.total).toFixed(2));
            state.tempTotalAmount = Number((state.tempTotalAmount + action.payload.total).toFixed(2));
            state.tempTotalHours = calculateTempTotalHours(state);
        },
        addDeferredTempPart: (state, action: PayloadAction<Part>) => {
            state.tempDeferredPart.push(action.payload);
        },
        addLabour: (state, action: PayloadAction<Labour>) => {
            state.labour.push(action.payload);
            const hours = action.payload.requiredHours / 60;
            const amount = Number((action.payload.ratePerHour * hours).toFixed(2));
            state.labourTotalAmount = Number((state.labourTotalAmount + amount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + amount).toFixed(2));
            state.labourTotalHours = calculateLabourTotalHours(state);
            state.totalHours = calculateTotalHours(state);
        },
        addDeferredLabour: (state, action: PayloadAction<Labour>) => {
            state.deferredLabour.push(action.payload);
        },
        addLabours: (state, action: PayloadAction<Labour[]>) => {
            state.labour.push(...action.payload);
            const totalAmount = action.payload.reduce((sum, labour) => {
                const hours = labour.requiredHours / 60;
                return sum + Number((labour.ratePerHour * hours).toFixed(2));
            }, 0);
            state.labourTotalAmount = Number((state.labourTotalAmount + totalAmount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + totalAmount).toFixed(2));
            state.labourTotalHours = calculateLabourTotalHours(state);
            state.totalHours = calculateTotalHours(state);
        },
        addDeferredLabours: (state, action: PayloadAction<Labour[]>) => {
            state.deferredLabour.push(...action.payload);
        },
        addChangeLabour: (state, action: PayloadAction<Labour>) => {
            state.changeLabour = action.payload;
        },
        addChangeDeferredLabour: (state, action: PayloadAction<Labour>) => {
            state.changeDeferredLabour = action.payload;
        },
        addTempLabour: (state, action: PayloadAction<Labour>) => {
            state.tempLabour.push(action.payload);
            const hours = action.payload.requiredHours / 60;
            const amount = Number((action.payload.ratePerHour * hours).toFixed(2));
            state.tempLabourTotalAmount = Number((state.tempLabourTotalAmount + amount).toFixed(2));
            state.tempTotalAmount = Number((state.tempTotalAmount + amount).toFixed(2));
            state.tempLabourTotalHours = calculateTempLabourTotalHours(state);
            state.tempTotalHours = calculateTempTotalHours(state);
        },
        addDeferredTempLabour: (state, action: PayloadAction<Labour>) => {
            state.tempDeferredLabour.push(action.payload);
        },
        addInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.inspectionHour.push(action.payload);
            const hours = action.payload.inspectionHours / 60;
            const amount = Number((action.payload.inspectionHourlyRate * hours).toFixed(2));
            state.inspectionTotalAmount = Number((state.inspectionTotalAmount + amount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + amount).toFixed(2));
            state.inspectionTotalHours = calculateInspectionTotalHours(state);
            state.totalHours = calculateTotalHours(state);
        },
        addDeferredInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.deferredInspectionHour.push(action.payload);
        },
        addInspectionHours: (state, action: PayloadAction<InspectionHour[]>) => {

            state.inspectionHour.push(...action.payload);
            const totalAmount = action.payload.reduce((sum, hour) => {
                const hours = hour.inspectionHours / 60;
                return sum + Number((hour.inspectionHourlyRate * hours).toFixed(2));
            }, 0);
            state.inspectionTotalAmount = Number((state.inspectionTotalAmount + totalAmount).toFixed(2));
            state.totalAmount = Number((state.totalAmount + totalAmount).toFixed(2));
            state.inspectionTotalHours = calculateInspectionTotalHours(state);
            state.totalHours = calculateTotalHours(state);
        },
        addDeferredInspectionHours: (state, action: PayloadAction<InspectionHour[]>) => {
            state.deferredInspectionHour.push(...action.payload);
        },
        addChangeInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.changeInspectionHour = action.payload;
        },
        addChangeDeferredInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.changeDeferredInspectionHour = action.payload;
        },
        addTempInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.tempInspectionHour.push(action.payload);
            const hours = action.payload.inspectionHours / 60;
            const amount = Number((action.payload.inspectionHourlyRate * hours).toFixed(2));
            state.tempInspectionTotalAmount = Number((state.tempInspectionTotalAmount + amount).toFixed(2));
            state.tempTotalAmount = Number((state.tempTotalAmount + amount).toFixed(2));
            state.tempInspectionTotalHours = calculateTempInspectionTotalHours(state);
            state.tempTotalHours = calculateTempTotalHours(state);
        },
        addDeferredTempInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            state.tempDeferredInspectionHour.push(action.payload);
        },
        addMechanicPercentage: (state, action: PayloadAction<MechanicPercentage>) => {
            state.mechanicPercentage.push(action.payload);
        },
        addDeferredMechanicPercentage: (state, action: PayloadAction<MechanicPercentage>) => {
            state.deferredMechanicPercentage.push(action.payload);
        },
        addMechanicPercentages: (state, action: PayloadAction<MechanicPercentage[]>) => {
            state.mechanicPercentage.push(...action.payload);
        },
        addEstimateTechnician: (state, action: PayloadAction<EstimateTechnician>) => {
            const exists = state.estimateTechnician.find((item) => item.id === action.payload.id);
            if (!exists) {
                state.estimateTechnician.push(action.payload);
            }
        },
        removeAllEstimateTechnician: (state) => {
           state.estimateTechnician = [];
        },
        addDeferredMechanicPercentages: (state, action: PayloadAction<MechanicPercentage[]>) => {
            state.deferredMechanicPercentage.push(...action.payload);
        },
        addChangeMechanicPercentage: (state, action: PayloadAction<ModifiedMechanicPercentage>) => {
            state.changeMechanicPercentage = action.payload;
        },
        addChangeDeferredMechanicPercentage: (state, action: PayloadAction<ModifiedMechanicPercentage>) => {
            state.changeDeferredMechanicPercentage = action.payload;
        },
        addTempMechanicPercentage: (state, action: PayloadAction<any>) => {
            const exists = state.tempMechanicPercentage.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.serviceCode === action.payload.serviceCode
            );

            if (!exists) {
                state.tempMechanicPercentage.push(action.payload);
            }
        },
        editTempMechanicPercentage: (state, action: PayloadAction<any>) => {
            const { id, serviceCode, percentage } = action.payload;
            const index = state.tempMechanicPercentage.findIndex(
                (item) => item.id === id && item.serviceCode === serviceCode
            );
            if (index !== -1) {
                state.tempMechanicPercentage[index].percentage = percentage;
            }
        },
        addDeferredTempMechanicPercentage: (state, action: PayloadAction<any>) => {
            const exists = state.tempDeferredMechanicPercentage.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.serviceCode === action.payload.serviceCode
            );
            if (!exists) {
                state.tempDeferredMechanicPercentage.push(action.payload);
            }
        },
        editDeferredTempMechanicPercentage: (state, action: PayloadAction<any>) => {
            const { id, serviceCode, percentage } = action.payload;
            const index = state.tempDeferredMechanicPercentage.findIndex(
                (item) => item.id === id && item.serviceCode === serviceCode
            );
            if (index !== -1) {
                state.tempDeferredMechanicPercentage[index].percentage = percentage;
            }
        },
        addInspectionPercentage: (state, action: PayloadAction<InspectionPercentage>) => {
            state.inspectionPercentage.push(action.payload);
        },
        addDeferredInspectionPercentage: (state, action: PayloadAction<InspectionPercentage>) => {
            state.deferredInspectionPercentage.push(action.payload);
        },
        addInspectionPercentages: (state, action: PayloadAction<InspectionPercentage[]>) => {
            state.inspectionPercentage.push(...action.payload);
        },
        addDeferredInspectionPercentages: (state, action: PayloadAction<InspectionPercentage[]>) => {
            state.deferredInspectionPercentage.push(...action.payload);
        },
        addChangeInspectionPercentage: (state, action: PayloadAction<ModifiedInspectionPercentage>) => {
            state.changeInspectionPercentage = action.payload;
        },
        addChangeDeferredInspectionPercentage: (state, action: PayloadAction<ModifiedInspectionPercentage>) => {
            state.changeDeferredInspectionPercentage = action.payload;
        },
        addTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const exists = state.tempInspectionPercentage.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.inspectionCode === action.payload.inspectionCode
            );
            if (!exists) {
                state.tempInspectionPercentage.push(action.payload);
            }
        },
        editTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const { id, inspectionCode, percentage } = action.payload;
            const index = state.tempInspectionPercentage.findIndex(
                (item) => item.id === id && item.inspectionCode === inspectionCode
            );
            if (index !== -1) {
                state.tempInspectionPercentage[index].percentage = percentage;
            }
        },
        addDeferredTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const exists = state.tempDeferredInspectionPercentage.find(
                (item) =>
                    item.id === action.payload.id &&
                    item.inspectionCode === action.payload.inspectionCode
            );
            if (!exists) {
                state.tempDeferredInspectionPercentage.push(action.payload);
            }
        },
        editDeferredTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const { id, inspectionCode, percentage } = action.payload;
            const index = state.tempDeferredInspectionPercentage.findIndex(
                (item) => item.id === id && item.inspectionCode === inspectionCode
            );
            if (index !== -1) {
                state.tempDeferredInspectionPercentage[index].percentage = percentage;
            }
        },
        removePart: (state, action: PayloadAction<{ name: string }>) => {
            const partToRemove = state.part.find((item) => item.name === action.payload.name);
            if (partToRemove) {
                const amount = Number((partToRemove.unitPrice * partToRemove.quantity).toFixed(2));
                state.partsTotalAmount = Number((state.partsTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));
            }
            state.part = state.part.filter((item) => item.name !== action.payload.name);
            state.totalHours = calculateTotalHours(state)
        },
        removeDeferredPart: (state, action: PayloadAction<{ name: string }>) => {
            state.deferredPart = state.deferredPart.filter((item) => item.name !== action.payload.name);
        },
        removePartById: (state, action: PayloadAction<any>) => {
            const partToRemove = state.part.find((item) => item.partId === action.payload);
            if (partToRemove) {
                const amount = Number((partToRemove.unitPrice * partToRemove.quantity).toFixed(2));
                state.partsTotalAmount = Number((state.partsTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));
            }
            state.part = state.part.filter((item) => item.partId !== action.payload);
            state.totalHours = calculateTotalHours(state)
        },
        removeDeferredPartById: (state, action: PayloadAction<any>) => {
            const partToRemove = state.deferredPart.find((item) => item.partId === action.payload);
            if (partToRemove) {
            }
            state.deferredPart = state.deferredPart.filter((item) => item.partId !== action.payload);
            // state.totalHours = calculateTotalHours(state)
        },
        removeTempPart: (state, action: PayloadAction<{ partId: number }>) => {
            const partToRemove = state.tempPart.find((item,index) => index === action.payload.partId);
            if (partToRemove) {
                const amount = Number((partToRemove.total).toFixed(2));
                state.tempPartsTotalAmount = Number((state.tempPartsTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));
            }
            state.tempPart = state.tempPart.filter((item,index) => index!== action.payload.partId);
            state.tempTotalHours = calculateTempTotalHours(state)
        },
        removeDeferredTempPart: (state, action: PayloadAction<{ partId: number }>) => {
            state.tempDeferredPart = state.tempDeferredPart.filter((item,index) => index !== action.payload.partId);
        },
        removeLabour: (state, action: PayloadAction<any>) => {
            const labourToRemove = state.labour.find((item) => item.name === action.payload.name);
            if (labourToRemove) {
                const hours = labourToRemove.requiredHours / 60;
                const amount = Number((labourToRemove.ratePerHour * hours).toFixed(2));
                state.labourTotalAmount = Number((state.labourTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));

            }
            state.labour = state.labour.filter((item) => item.name !== action.payload.name);
            state.totalHours = calculateTotalHours(state)
            state.labourTotalHours = calculateLabourTotalHours(state);
        },
        removeDeferredLabour: (state, action: PayloadAction<any>) => {
            state.deferredLabour = state.deferredLabour.filter((item) => item.name !== action.payload.name);
        },
        removeLabourById: (state, action: PayloadAction<any>) => {
            const labourToRemove = state.labour.find((item) => item.labourId === action.payload);
            if (labourToRemove) {
                const hours = labourToRemove.requiredHours / 60;
                const amount = Number((labourToRemove.ratePerHour * hours).toFixed(2));
                state.labourTotalAmount = Number((state.labourTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));
            }
            state.labour = state.labour.filter((item) => item.labourId !== action.payload);
            state.totalHours = calculateTotalHours(state)
            state.labourTotalHours = calculateLabourTotalHours(state);
        },
        removeDeferredLabourById: (state, action: PayloadAction<any>) => {
            state.deferredLabour = state.deferredLabour.filter((item) => item.labourId !== action.payload);
        },
        removeTempLabour: (state, action: PayloadAction<any>) => {
            const labourToRemove = state.tempLabour.find((item,index) => index === action.payload.labourId);
            if (labourToRemove) {
                const hours = labourToRemove.requiredHours / 60;
                const amount = Number((labourToRemove.ratePerHour * hours).toFixed(2));
                state.tempLabourTotalAmount = Number((state.tempLabourTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));

            }
            state.tempLabour = state.tempLabour.filter((item,index) => index !== action.payload.labourId);
            state.tempTotalHours = calculateTempTotalHours(state)
            state.tempLabourTotalHours = calculateTempLabourTotalHours(state);
        },
        removeDeferredTempLabour: (state, action: PayloadAction<any>) => {
            state.tempDeferredLabour = state.tempDeferredLabour.filter((item,index) => index !== action.payload.labourId);
        },
        removeInspectionHour: (state, action: PayloadAction<any>) => {
            const inspectionToRemove = state.inspectionHour.find((item) => item.inspectionHours === action.payload.inspectionHours);
            if (inspectionToRemove) {
                const hours = inspectionToRemove.inspectionHours / 60;
                const amount = Number((inspectionToRemove.inspectionHourlyRate * hours).toFixed(2));
                state.inspectionTotalAmount = Number((state.inspectionTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));
            }
            state.inspectionHour = state.inspectionHour.filter((item) => item.inspectionHours !== action.payload.inspectionHours);
            state.totalHours = calculateTotalHours(state)
            state.inspectionTotalHours = calculateInspectionTotalHours(state);
        },
        removeDeferredInspectionHour: (state, action: PayloadAction<any>) => {
            state.deferredInspectionHour = state.deferredInspectionHour.filter((item) => item.inspectionHours !== action.payload.inspectionHours);
        },
        removeInspectionHourById: (state, action: PayloadAction<any>) => {
            const inspectionHourToRemove = state.inspectionHour.find((item) => item.inspectionHourId === action.payload);
            if (inspectionHourToRemove) {
                const hours = inspectionHourToRemove.inspectionHours / 60;
                const amount = Number((inspectionHourToRemove.inspectionHourlyRate * hours).toFixed(2));
                state.inspectionTotalAmount = Number((state.inspectionTotalAmount - amount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - amount).toFixed(2));
            }
            state.inspectionHour = state.inspectionHour.filter((item) => item.inspectionHourId !== action.payload);
            state.totalHours = calculateTotalHours(state)
            state.inspectionTotalHours = calculateInspectionTotalHours(state);
        },
        removeDeferredInspectionHourById: (state, action: PayloadAction<any>) => {
            state.deferredInspectionHour = state.deferredInspectionHour.filter((item) => item.inspectionHourId !== action.payload);
        },
        removeTempInspectionHour: (state, action: PayloadAction<any>) => {
            const inspectionToRemove = state.tempInspectionHour.find((item) => item.inspectionHours === action.payload.inspectionHours);
            if (inspectionToRemove) {
                const hours = inspectionToRemove.inspectionHours / 60;
                const amount = Number((inspectionToRemove.inspectionHourlyRate * hours).toFixed(2));
                state.tempInspectionTotalAmount = Number((state.tempInspectionTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));
            }
            state.tempInspectionHour = state.tempInspectionHour.filter((item) => item.inspectionHours !== action.payload.inspectionHours);
            state.tempTotalHours = calculateTempTotalHours(state)
            state.tempInspectionTotalHours = calculateTempInspectionTotalHours(state);
        },
        removeDeferredTempInspectionHour: (state, action: PayloadAction<any>) => {
            state.tempDeferredInspectionHour = state.tempDeferredInspectionHour.filter((item) => item.inspectionHours !== action.payload.inspectionHours);
        },
        removeMechanicPercentage: (state, action: PayloadAction<any>) => {
            state.mechanicPercentage = state.mechanicPercentage.filter(
                (item) => item.id !== action.payload.id
            );
        },
        removeDeferredMechanicPercentage: (state, action: PayloadAction<any>) => {
            state.deferredMechanicPercentage = state.deferredMechanicPercentage.filter((item) => item.id !== action.payload.id);
        },
        removeMechanicPercentageById: (state, action: PayloadAction<any>) => {
            state.mechanicPercentage = state.mechanicPercentage.filter(
                (item) => item.mechanicPercentageId !== action.payload
            );
        },
        removeDeferredMechanicPercentageById: (state, action: PayloadAction<any>) => {
            state.deferredMechanicPercentage = state.deferredMechanicPercentage.filter((item) => item.mechanicPercentageId !== action.payload);
        },
        removeTempMechanicPercentage: (state, action: PayloadAction<{ id: string; serviceCode: string }>) => {
            const { id, serviceCode } = action.payload;

            // Remove the item
            state.tempMechanicPercentage = state.tempMechanicPercentage.filter(
                (item) => !(item.id === id && item.serviceCode === serviceCode)
            );

            // Recalculate percentages for remaining items with the same serviceCode
            const updated = state.tempMechanicPercentage.filter(item => item.serviceCode === serviceCode);
            const count = updated.length;
            const percentage = count > 0 ? (100 / count).toFixed(2) + "%" : "100%";

            state.tempMechanicPercentage = state.tempMechanicPercentage.map(item =>
                item.serviceCode === serviceCode
                    ? { ...item, percentage }
                    : item
            );
        },

        removeDeferredTempMechanicPercentage: (state, action: PayloadAction<{ id: string; serviceCode: string }>) => {
            const { id, serviceCode } = action.payload;

            // Remove the item
            state.tempDeferredMechanicPercentage = state.tempDeferredMechanicPercentage.filter(
                (item) => !(item.id === id && item.serviceCode === serviceCode)
            );

            // Recalculate percentages for remaining items with the same serviceCode
            const updated = state.tempDeferredMechanicPercentage.filter(item => item.serviceCode === serviceCode);
            const count = updated.length;
            const percentage = count > 0 ? (100 / count).toFixed(2) + "%" : "100%";

            state.tempDeferredMechanicPercentage = state.tempDeferredMechanicPercentage.map(item =>
                item.serviceCode === serviceCode
                    ? { ...item, percentage }
                    : item
            );
        },

        removeInspectionPercentage: (state, action: PayloadAction<any>) => {
            state.inspectionPercentage = state.inspectionPercentage.filter(
                (item) => item.id !== action.payload.id
            );
        },
        removeDeferredInspectionPercentage: (state, action: PayloadAction<any>) => {
            state.deferredInspectionPercentage = state.deferredInspectionPercentage.filter((item) => item.id !== action.payload.id);
        },
        removeInspectionPercentageById: (state, action: PayloadAction<any>) => {
            state.inspectionPercentage = state.inspectionPercentage.filter(
                (item) => item.inspectionPercentageId !== action.payload
            );
        },
        removeDeferredInspectionPercentageById: (state, action: PayloadAction<any>) => {
            state.deferredInspectionPercentage = state.deferredInspectionPercentage.filter((item) => item.inspectionPercentageId !== action.payload);
        },
        removeTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const { id, inspectionCode } = action.payload;

            // Remove the item
            state.tempInspectionPercentage = state.tempInspectionPercentage.filter(
                (item) => !(item.id === id && item.inspectionCode === inspectionCode)
            );

            // Recalculate percentages for remaining items with the same serviceCode
            const updated = state.tempInspectionPercentage.filter(item => item.inspectionCode === inspectionCode);
            const count = updated.length;
            const percentage = count > 0 ? (100 / count).toFixed(2) + "%" : "100%";

            state.tempInspectionPercentage = state.tempInspectionPercentage.map(item =>
                item.inspectionCode === inspectionCode
                    ? { ...item, percentage }
                    : item
            );
        },
        removeDeferredTempInspectionPercentage: (state, action: PayloadAction<any>) => {
            const { id, inspectionCode } = action.payload;

            // Remove the item
            state.tempDeferredInspectionPercentage = state.tempDeferredInspectionPercentage.filter(
                (item) => !(item.id === id && item.inspectionCode === inspectionCode)
            );

            // Recalculate percentages for remaining items with the same serviceCode
            const updated = state.tempDeferredInspectionPercentage.filter(item => item.inspectionCode === inspectionCode);
            const count = updated.length;
            const percentage = count > 0 ? (100 / count).toFixed(2) + "%" : "100%";

            state.tempDeferredInspectionPercentage = state.tempDeferredInspectionPercentage.map(item =>
                item.inspectionCode === inspectionCode
                    ? { ...item, percentage }
                    : item
            );
        },
        removeAllLabours: (state) => {
            state.labour = [];
            state.labourTotalAmount = 0;
            state.totalAmount = calculateTotalAmount(state);
            state.labourTotalHours = "00:00";
            calculateTotalHours(state);
        },
        removeALLTempLabour: (state) => {
            state.tempLabour = [];
            state.tempLabourTotalAmount = 0;
            state.totalAmount = calculateTotalAmount(state);
            state.tempLabourTotalHours = "00:00";
            calculateTotalHours(state);
        },
        removeAllParts: (state) => {
            state.part = [];
            state.partsTotalAmount = 0;
            state.totalAmount = calculateTotalAmount(state);
            calculateTotalHours(state);
        },
        removeAllTempParts: (state) => {
            state.tempPart = [];
            state.tempPartsTotalAmount = 0;
            state.tempTotalAmount = calculateTotalAmount(state);
            calculateTotalHours(state);
        },
        removeAllInspectionHours: (state) => {
            state.inspectionHour = [];
            state.inspectionTotalAmount = 0;
            state.totalAmount = calculateTotalAmount(state);
            calculateTotalHours(state);
        },
        removeAllMechanicPercentages: (state) => {
            state.mechanicPercentage = [];
            state.totalAmount = calculateTotalAmount(state);
            calculateTotalHours(state);
        },
        removeAllInspectionPercentages: (state) => {
            state.inspectionPercentage = [];
            state.totalAmount = calculateTotalAmount(state);
            calculateTotalHours(state);
        },
        removeAllTotal: (state) => {
            state.totalAmount = 0;
            state.partsTotalAmount = 0;
            state.labourTotalAmount = 0;
            state.inspectionTotalAmount = 0;
            state.totalHours = "00:00";
            state.labourTotalHours = "00:00";
            state.inspectionTotalHours = "00:00";
        },
        removePartSingleData: (state,) => {
            state.changePart = {
                serviceCode: "",
                partId: "",
                name: "",
                unitPrice: 0,
                provider: "",
                installationHours: 0,
                quantity: 0,
                total: 0,
                margin: 0
            }
        },
        removeDeferredPartSingleData: (state) => {
            state.changeDeferredPart = {
                serviceCode: "",
                partId: "",
                name: "",
                unitPrice: 0,
                provider: "",
                installationHours: 0,
                quantity: 0,
                total: 0,
                margin: 0
            }
        },

        removeLabourSingleData: (state) => {
            state.changeLabour = {
                serviceCode: "",
                labourId: "",
                name: "",
                ratePerHour: 0,
                requiredHours: 0
            }
        },
        removeDeferredLabourSingleData: (state) => {
            state.changeDeferredLabour = {
                serviceCode: "",
                labourId: "",
                name: "",
                ratePerHour: 0,
                requiredHours: 0
            }
        },
        removeInspectionHourSingleData: (state) => {
            state.changeInspectionHour = {
                inspectionCode: "",
                inspectionHourId: "",
                inspectionHours: 0,
                inspectionHourlyRate: 0
            }
        },
        removeDeferredInspectionHourSingleData: (state) => {
            state.changeDeferredInspectionHour = {
                inspectionCode: "",
                inspectionHourId: "",
                inspectionHours: 0,
                inspectionHourlyRate: 0
            }
        },
        removeMechanicPercentageSingleData: (state) => {
            state.changeMechanicPercentage = {
                serviceCode: "",
                mechanicPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            }
        },
        removeDeferredMechanicPercentageSingleData: (state) => {
            state.changeDeferredMechanicPercentage = {
                serviceCode: "",
                mechanicPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            }
        },
        removeInspectionPercentageSingleData: (state) => {
            state.changeInspectionPercentage = {
                inspectionCode: "",
                inspectionPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            }
        },
        removeDeferredInspectionPercentageSingleData: (state) => {
            state.changeDeferredInspectionPercentage = {
                inspectionCode: "",
                inspectionPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            }
        },
        removeAllState: (state) => {
            state.part = [];
            state.tempPart = [];
            state.deferredPart = [];
            state.tempDeferredPart = [];
            state.changeDeferredPart = {
                serviceCode: "",
                partId: "",
                name: "",
                unitPrice: 0,
                provider: "",
                installationHours: 0,
                quantity: 0,
                total: 0,
                margin: 0 
            };
            state.labour = [];
            state.tempLabour = [];
            state.deferredLabour = [];
            state.tempDeferredLabour = [];
            state.changeDeferredLabour = {
                serviceCode: "",
                labourId: "",
                name: "",
                ratePerHour: 0,
                requiredHours: 0
            };
            state.mechanicPercentage = [];
            state.tempMechanicPercentage = [];
            state.estimateTechnician = [];
            state.deferredMechanicPercentage = [];
            state.tempDeferredMechanicPercentage = [];
            state.changeDeferredMechanicPercentage = {
                serviceCode: "",
                mechanicPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            };
            state.inspectionHour = [];
            state.tempInspectionHour = [];
            state.deferredInspectionHour = [];
            state.tempDeferredInspectionHour = [];
            state.changeDeferredInspectionHour = {
                inspectionCode: "",
                inspectionHourId: "",
                inspectionHours: 0,
                inspectionHourlyRate: 0
            };
            state.inspectionPercentage = [];
            state.tempInspectionPercentage = [];
            state.deferredInspectionPercentage = [];
            state.tempDeferredInspectionPercentage = [];
            state.changeDeferredInspectionPercentage = {
                inspectionCode: "",
                inspectionPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            };
            state.partsTotalAmount = 0;
            state.tempPartsTotalAmount = 0;
            state.labourTotalAmount = 0;
            state.tempLabourTotalAmount = 0;
            state.inspectionTotalAmount = 0;
            state.tempInspectionTotalAmount = 0;
            state.totalAmount = 0;
            state.tempTotalAmount = 0;
            state.inspectionTotalHours = "00:00";
            state.tempInspectionTotalHours = "00:00";
            state.labourTotalHours = "00:00";
            state.tempLabourTotalHours = "00:00";
            state.totalHours = "00:00";
            state.tempTotalHours = "00:00";
            state.updateStatusInspectionHour = false;
            state.deleteStatusInspectionHour = false;
            state.updateStatusMechanicPercentage = false;
            state.deleteStatusMechanicPercentage = false;
            state.updateStatusInspectionPercentage = false;
            state.deleteStatusInspectionPercentage = false;
            state.updateStatusPart = false;
            state.deleteStatusPart = false;
            state.updateStatusLabour = false;
            state.deleteStatusLabour = false;
            state.newInsertInspectionHour = false;
            state.newInsertMechanicPercentage = false;
            state.newInsertInspectionPercentage = false;
            state.newInsertPart = false;
            state.updateEstimateTechnicianStatus = false;
            state.changePart = {
                serviceCode: "",
                partId: "",
                name: "",
                unitPrice: 0,
                provider: "",
                installationHours: 0,
                quantity: 0,
                total: 0,
                margin: 0
            };
            state.changeLabour = {
                serviceCode: "",
                labourId: "",
                name: "",
                ratePerHour: 0,
                requiredHours: 0
            };
            state.changeInspectionHour = {
                inspectionCode: "",
                inspectionHourId: "",
                inspectionHours: 0,
                inspectionHourlyRate: 0
            };
            state.changeMechanicPercentage = {
                serviceCode: "",
                mechanicPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            };
            state.changeInspectionPercentage = {
                inspectionCode: "",
                inspectionPercentageId: "",
                id: "",
                name: "",
                percentage: ""
            };
        },
        removeAllTempInspectionItems: (state) => {
            state.tempInspectionHour = [];
            state.tempDeferredInspectionHour = [];
            state.tempInspectionPercentage = [];
            state.tempDeferredInspectionPercentage = [];
            state.tempInspectionTotalAmount = 0;
            state.tempTotalAmount = 0;
            state.tempInspectionTotalHours = "00:00";
            state.tempTotalHours = "00:00";
        },
        removeAllTempServiceItems: (state) => {
            state.tempPart = [];
            state.tempLabour = [];
            state.tempMechanicPercentage = [];
            state.tempDeferredPart = [];
            state.tempDeferredLabour = [];
            state.tempDeferredMechanicPercentage = [];
            state.tempPartsTotalAmount = 0;
            state.tempLabourTotalAmount = 0;
            state.tempTotalAmount = 0;
            state.tempLabourTotalHours = "00:00";
            state.tempTotalHours = "00:00";
        },
        updatePart: (state, action: PayloadAction<Part>) => {
            const partToUpdate = state.part.find((item) => item.partId === action.payload.partId);
            if (partToUpdate) {
                const oldAmount = Number((partToUpdate?.total).toFixed(2));
                partToUpdate.unitPrice = action.payload.unitPrice;
                partToUpdate.name = action.payload.name;
                partToUpdate.quantity = action.payload.quantity;
                partToUpdate.margin = action.payload.margin;
                partToUpdate.total = action.payload.total;
                partToUpdate.installationHours = action.payload.installationHours;
                const newAmount = Number((action.payload?.total).toFixed(2));
                state.partsTotalAmount = Number((state.partsTotalAmount - oldAmount + newAmount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - oldAmount + newAmount).toFixed(2));
                state.totalHours = calculateTotalHours(state);
            }
        },
        updateDeferredPart: (state, action: PayloadAction<Part>) => {
            const partToUpdate = state.deferredPart.find((item) => item.partId === action.payload.partId);
            if (partToUpdate) {
                partToUpdate.unitPrice = action.payload.unitPrice;
                partToUpdate.quantity = action.payload.quantity;
            }
        },
        updateLabour: (state, action: PayloadAction<Labour>) => {
            const labourToUpdate = state.labour.find((item) => item.labourId === action.payload.labourId);
            if (labourToUpdate) {
                const oldHours = labourToUpdate.requiredHours / 60;
                const oldAmount = Number((labourToUpdate.ratePerHour * oldHours).toFixed(2));
                labourToUpdate.ratePerHour = action.payload.ratePerHour;
                labourToUpdate.requiredHours = action.payload.requiredHours;

                const newHours = action.payload.requiredHours / 60;
                const newAmount = Number((action.payload.ratePerHour * newHours).toFixed(2));
                state.labourTotalAmount = Number((state.labourTotalAmount - oldAmount + newAmount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - oldAmount + newAmount).toFixed(2));

                state.totalHours = calculateTotalHours(state);
                state.labourTotalHours = calculateLabourTotalHours(state);
            }
        },
        updateDeferredLabour: (state, action: PayloadAction<Labour>) => {
            const labourToUpdate = state.deferredLabour.find((item) => item.labourId === action.payload.labourId);
            if (labourToUpdate) {
                labourToUpdate.ratePerHour = action.payload.ratePerHour;
                labourToUpdate.requiredHours = action.payload.requiredHours;
            }
        },
        updateInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            const inspectionToUpdate = state.inspectionHour.find((item) => item.inspectionHourId === action.payload.inspectionHourId);
            if (inspectionToUpdate) {

                const oldHours = inspectionToUpdate.inspectionHours / 60;
                const oldAmount = Number((inspectionToUpdate.inspectionHourlyRate * oldHours).toFixed(2));

                inspectionToUpdate.inspectionHours = action.payload.inspectionHours;
                inspectionToUpdate.inspectionHourlyRate = action.payload.inspectionHourlyRate;

                const newHours = action.payload.inspectionHours / 60;
                const newAmount = Number((action.payload.inspectionHourlyRate * newHours).toFixed(2));

                state.inspectionTotalAmount = Number((state.inspectionTotalAmount - oldAmount + newAmount).toFixed(2));
                state.totalAmount = Number((state.totalAmount - oldAmount + newAmount).toFixed(2));

                state.inspectionTotalHours = calculateInspectionTotalHours(state);
                state.totalHours = calculateTotalHours(state);
            }
        },
        updateDeferredInspectionHour: (state, action: PayloadAction<InspectionHour>) => {
            const inspectionToUpdate = state.deferredInspectionHour.find((item) => item.inspectionHourId === action.payload.inspectionHourId);
            if (inspectionToUpdate) {
                inspectionToUpdate.inspectionHours = action.payload.inspectionHours;
                inspectionToUpdate.inspectionHourlyRate = action.payload.inspectionHourlyRate;
            }
        },
        updateMechanicPercentage: (state, action: PayloadAction<MechanicPercentage>) => {
            const mechanicPercentageToUpdate = state.mechanicPercentage.find((item) => item.mechanicPercentageId === action.payload.mechanicPercentageId);
            if (mechanicPercentageToUpdate) {
                mechanicPercentageToUpdate.percentage = action.payload.percentage;
            }
        },
        updateDeferredMechanicPercentage: (state, action: PayloadAction<MechanicPercentage>) => {
            const mechanicPercentageToUpdate = state.deferredMechanicPercentage.find((item) => item.mechanicPercentageId === action.payload.mechanicPercentageId);
            if (mechanicPercentageToUpdate) {
                mechanicPercentageToUpdate.percentage = action.payload.percentage;
            }
        },
        updateInspectionPercentage: (state, action: PayloadAction<InspectionPercentage>) => {
            const inspectionPercentageToUpdate = state.inspectionPercentage.find((item) => item.inspectionPercentageId === action.payload.inspectionPercentageId);
            if (inspectionPercentageToUpdate) {
                inspectionPercentageToUpdate.percentage = action.payload.percentage;
            }
        },
        updateDeferredInspectionPercentage: (state, action: PayloadAction<InspectionPercentage>) => {
            const inspectionPercentageToUpdate = state.deferredInspectionPercentage.find((item) => item.inspectionPercentageId === action.payload.inspectionPercentageId);
            if (inspectionPercentageToUpdate) {
                inspectionPercentageToUpdate.percentage = action.payload.percentage;
            }
        },
        setUpdateStatusInspectionHour: (state, action: PayloadAction<boolean>) => {
            state.updateStatusInspectionHour = action.payload;
        },
        setDeleteStatusInspectionHour: (state, action: PayloadAction<boolean>) => {
            state.deleteStatusInspectionHour = action.payload;
        },
        setUpdateStatusMechanicPercentage: (state, action: PayloadAction<boolean>) => {
            state.updateStatusMechanicPercentage = action.payload;
        },
        setDeleteStatusMechanicPercentage: (state, action: PayloadAction<boolean>) => {
            state.deleteStatusMechanicPercentage = action.payload;
        },
        setUpdateStatusInspectionPercentage: (state, action: PayloadAction<boolean>) => {
            state.updateStatusInspectionPercentage = action.payload;
        },
        setDeleteStatusInspectionPercentage: (state, action: PayloadAction<boolean>) => {
            state.deleteStatusInspectionPercentage = action.payload;
        },
        setUpdateStatusPart: (state, action: PayloadAction<boolean>) => {
            state.updateStatusPart = action.payload;
        },
        setDeleteStatusPart: (state, action: PayloadAction<boolean>) => {
            state.deleteStatusPart = action.payload;
        },
        setUpdateStatusLabour: (state, action: PayloadAction<boolean>) => {
            state.updateStatusLabour = action.payload;
        },
        setDeleteStatusLabour: (state, action: PayloadAction<boolean>) => {
            state.deleteStatusLabour = action.payload;
        },
        setNewInsertInspectionHour: (state, action: PayloadAction<boolean>) => {
            state.newInsertInspectionHour = action.payload;
        },
        setNewInsertMechanicPercentage: (state, action: PayloadAction<boolean>) => {
            state.newInsertMechanicPercentage = action.payload;
        },
        setNewInsertInspectionPercentage: (state, action: PayloadAction<boolean>) => {
            state.newInsertInspectionPercentage = action.payload;
        },
        setNewInsertPart: (state, action: PayloadAction<boolean>) => {
            state.newInsertPart = action.payload;
        },
        setNewInsertLabour: (state, action: PayloadAction<boolean>) => {
            state.newInsertLabour = action.payload;
        },
        removeNewInsertInspectionHour: (state) => {
            state.newInsertInspectionHour = false;
        },
        removeInspectionHours: (state) => {
            state.inspectionHour = []
        },
        switchServiceAcceptToDeferred: (state, action: PayloadAction<string>) => {
            const serviceCode = action.payload;

            // Handle Parts (Multiple Items)
            const matchingParts = state.tempPart.filter(p => p.serviceCode === serviceCode && p.serviceStage === "Accept");

            matchingParts.forEach(part => {
                part.serviceStage = "Deferred";
                state.tempDeferredPart.push(part);

                // Correct price calculation
                const amount = Number((part.unitPrice * part.quantity).toFixed(2));
                state.tempPartsTotalAmount = Number((state.tempPartsTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));
            });

            state.tempPart = state.tempPart.filter(p => p.serviceCode !== serviceCode);

            const matchingLabours = state.tempLabour.filter(l => l.serviceCode === serviceCode);

            matchingLabours.forEach(labour => {
                labour.serviceStage = "Deferred";
                state.tempDeferredLabour.push(labour);

                const hours = labour.requiredHours / 60;
                const amount = Number((labour.ratePerHour * hours).toFixed(2));
                state.tempLabourTotalAmount = Number((state.tempLabourTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));
            });

            state.tempLabour = state.tempLabour.filter(l => l.serviceCode !== serviceCode);

            state.tempTotalHours = calculateTempTotalHours(state);
            state.tempLabourTotalHours = calculateTempLabourTotalHours(state);

            const matchingMechanics = state.tempMechanicPercentage.filter(m => m.serviceCode === serviceCode);

            matchingMechanics.forEach(mechanicPercentage => {
                mechanicPercentage.serviceStage = "Deferred";
                state.tempDeferredMechanicPercentage.push(mechanicPercentage);
            });

            state.tempMechanicPercentage = state.tempMechanicPercentage.filter(m => m.serviceCode !== serviceCode);
        },

        switchServiceDeferredToAccept: (state, action: PayloadAction<string>) => {
            const serviceCode = action.payload;

            const matchingParts = state.tempDeferredPart.filter(p => p.serviceCode === serviceCode && p.serviceStage === "Deferred");

            matchingParts.forEach(part => {
                part.serviceStage = "Accept";
                state.tempPart.push(part);

                const amount = Number((part.unitPrice * part.quantity).toFixed(2));
                state.tempPartsTotalAmount = Number((state.tempPartsTotalAmount + amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount + amount).toFixed(2));
            });

            state.tempDeferredPart = state.tempDeferredPart.filter(p => p.serviceCode !== serviceCode);

            const matchingLabours = state.tempDeferredLabour.filter(l => l.serviceCode === serviceCode);

            matchingLabours.forEach(labour => {
                labour.serviceStage = "Accept";
                state.tempLabour.push(labour);

                const hours = labour.requiredHours / 60;
                const amount = Number((labour.ratePerHour * hours).toFixed(2));
                state.tempLabourTotalAmount = Number((state.tempLabourTotalAmount + amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount + amount).toFixed(2));
            });

            state.tempDeferredLabour = state.tempDeferredLabour.filter(l => l.serviceCode !== serviceCode);

            state.tempTotalHours = calculateTempTotalHours(state);
            state.tempLabourTotalHours = calculateTempLabourTotalHours(state);

            const matchingMechanics = state.tempDeferredMechanicPercentage.filter(m => m.serviceCode === serviceCode);

            matchingMechanics.forEach(mechanicPercentage => {
                mechanicPercentage.serviceStage = "Accept";
                state.tempMechanicPercentage.push(mechanicPercentage);
            });

            state.tempDeferredMechanicPercentage = state.tempDeferredMechanicPercentage.filter(m => m.serviceCode !== serviceCode);
        },

        switchInspectionAcceptToDeferred: (state, action: PayloadAction<string>) => {
            const inspectionCode = action.payload;

            // Handle Inspection Hours
            const matchingHours = state.tempInspectionHour.filter(
                h => h.inspectionCode === inspectionCode && h.inspectionStage === "Accept"
            );

            matchingHours.forEach(hour => {
                hour.inspectionStage = "Deferred";
                state.tempDeferredInspectionHour.push(hour);

                const hours = hour.inspectionHours / 60;
                const amount = Number((hours * hour.inspectionHourlyRate).toFixed(2));
                state.tempInspectionTotalAmount = Number((state.tempInspectionTotalAmount - amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - amount).toFixed(2));
            });

            state.tempInspectionHour = state.tempInspectionHour.filter(h => h.inspectionCode !== inspectionCode);

            state.tempTotalHours = calculateTempTotalHours(state);
            state.tempInspectionTotalHours = calculateTempInspectionTotalHours(state);

            // Handle Inspection Percentage
            const matchingPercentages = state.tempInspectionPercentage.filter(
                p => p.inspectionCode === inspectionCode
            );

            matchingPercentages.forEach(percentage => {
                percentage.inspectionStage = "Deferred";
                state.tempDeferredInspectionPercentage.push(percentage);
            });

            state.tempInspectionPercentage = state.tempInspectionPercentage.filter(p => p.inspectionCode !== inspectionCode);
        },
        switchInspectionDeferredToAccept: (state, action: PayloadAction<string>) => {
            const inspectionCode = action.payload;

            // Handle Inspection Hours
            const matchingHours = state.tempDeferredInspectionHour.filter(
                h => h.inspectionCode === inspectionCode && h.inspectionStage === "Deferred"
            );

            matchingHours.forEach(hour => {
                hour.inspectionStage = "Accept";
                state.tempInspectionHour.push(hour);

                const hours = hour.inspectionHours / 60;
                const amount = Number((hours * hour.inspectionHourlyRate).toFixed(2));
                state.tempInspectionTotalAmount = Number((state.tempInspectionTotalAmount + amount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount + amount).toFixed(2));
            });

            state.tempDeferredInspectionHour = state.tempDeferredInspectionHour.filter(h => h.inspectionCode !== inspectionCode);

            state.tempTotalHours = calculateTempTotalHours(state);
            state.tempInspectionTotalHours = calculateTempInspectionTotalHours(state);

            // Handle Inspection Percentage
            const matchingPercentages = state.tempDeferredInspectionPercentage.filter(
                p => p.inspectionCode === inspectionCode
            );

            matchingPercentages.forEach(percentage => {
                percentage.inspectionStage = "Accept";
                state.tempInspectionPercentage.push(percentage);
            });

            state.tempDeferredInspectionPercentage = state.tempDeferredInspectionPercentage.filter(p => p.inspectionCode !== inspectionCode);
        },
        removeAllInspectionItem: () => {
            return initialState;
        },
        updateDeferredTempMechanicPercentage: (
            state,
            action: PayloadAction<any>
        ) => {
            const index = state.tempDeferredMechanicPercentage.findIndex(
                (m) =>
                    m.id === action.payload.id &&
                    m.serviceCode === action.payload.serviceCode
            );
            if (index !== -1) {
                state.tempDeferredMechanicPercentage[index] = action.payload;
            }
        },

        updateTempMechanicPercentage: (
            state,
            action: PayloadAction<any>
        ) => {
            const index = state.tempMechanicPercentage.findIndex(
                (m) =>
                    m.id === action.payload.id &&
                    m.serviceCode === action.payload.serviceCode
            );
            if (index !== -1) {
                state.tempMechanicPercentage[index] = action.payload;
            }
        },
        updateDeferredTempInspectionPercentage: (
            state,
            action: PayloadAction<any>
        ) => {
            const index = state.tempDeferredInspectionPercentage.findIndex(
                (m) =>
                    m.id === action.payload.id &&
                    m.inspectionCode === action.payload.inspectionCode
            );
            if (index !== -1) {
                state.tempDeferredInspectionPercentage[index] = action.payload;
            }
        },
        updateTempInspectionPercentage: (
            state,
            action: PayloadAction<any>
        ) => {
            const index = state.tempInspectionPercentage.findIndex(
                (m) =>
                    m.id === action.payload.id &&
                    m.inspectionCode === action.payload.inspectionCode
            );
            if (index !== -1) {
                state.tempInspectionPercentage[index] = action.payload;
            }
        },
        setEstimateTechnicianUpdateStatus: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.updateEstimateTechnicianStatus = action.payload;
        },
         updateTempPart: (state, action: PayloadAction<Part>) => {
            const partToUpdate = state.tempPart.find((item,index) => index === parseInt(action?.payload?.partId as string));
            if (partToUpdate) {
                const oldAmount = Number((partToUpdate?.total).toFixed(2));
                partToUpdate.unitPrice = action.payload.unitPrice;
                partToUpdate.name = action.payload.name;
                partToUpdate.quantity = action.payload.quantity;
                partToUpdate.margin = action.payload.margin;
                partToUpdate.total = action.payload.total;
                partToUpdate.installationHours = action.payload.installationHours;
                const newAmount = Number((action.payload?.total).toFixed(2));
                state.tempPartsTotalAmount = Number((state.tempPartsTotalAmount - oldAmount + newAmount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - oldAmount + newAmount).toFixed(2));
                state.tempTotalHours = calculateTempTotalHours(state);
            }
        },
         updateDeferredTempPart: (state, action: PayloadAction<Part>) => {
            const temPartToUpdate = state.tempDeferredPart.find((item,index) => index === parseInt(action?.payload?.partId as string));
            if (temPartToUpdate) {
                temPartToUpdate.unitPrice = action.payload.unitPrice;
                temPartToUpdate.name = action.payload.name;
                temPartToUpdate.quantity = action.payload.quantity;
                temPartToUpdate.margin = action.payload.margin;
                temPartToUpdate.total = action.payload.total;
                temPartToUpdate.installationHours = action.payload.installationHours;
                
            }
        },
        updateTempLabour: (state, action: PayloadAction<any>) => {
            const labourToUpdate = state.tempLabour.find((item,index) => index === action.payload.labourId);
            if (labourToUpdate) {
                const oldHours = labourToUpdate.requiredHours / 60;
                const oldAmount = Number((labourToUpdate.ratePerHour * oldHours).toFixed(2));
                labourToUpdate.ratePerHour = action.payload.ratePerHour;
                labourToUpdate.requiredHours = action.payload.requiredHours;

                const newHours = action.payload.requiredHours / 60;
                const newAmount = Number((action.payload.ratePerHour * newHours).toFixed(2));
                state.tempLabourTotalAmount = Number((state.tempLabourTotalAmount - oldAmount + newAmount).toFixed(2));
                state.tempTotalAmount = Number((state.tempTotalAmount - oldAmount + newAmount).toFixed(2));

                state.tempTotalHours = calculateTotalHours(state);
                state.tempLabourTotalHours = calculateLabourTotalHours(state);
            }
        },
        updateTempDeferredLabour: (state, action: PayloadAction<any>) => {
            const labourToUpdate = state.tempDeferredLabour.find((item,index) => index=== action.payload.labourId);
            if (labourToUpdate) {
                labourToUpdate.ratePerHour = action.payload.ratePerHour;
                labourToUpdate.requiredHours = action.payload.requiredHours;
            }
        },


    },
});


// Export actions and reducer
export const {
    addPart,
    addLabour,
    addMechanicPercentage,
    addInspectionHour,
    addInspectionPercentage,
    removePart,
    removeLabour,
    removeMechanicPercentage,
    removeInspectionHour,
    removeInspectionPercentage,
    removeAllState,
    removePartSingleData,
    removeLabourSingleData,
    removeInspectionHourSingleData,
    removeMechanicPercentageSingleData,
    removeInspectionPercentageSingleData,
    updatePart,
    updateLabour,
    updateInspectionHour,
    updateMechanicPercentage,
    updateInspectionPercentage,
    addParts,
    addLabours,
    addInspectionHours,
    addMechanicPercentages,
    addInspectionPercentages,
    setUpdateStatusInspectionHour,
    setDeleteStatusInspectionHour,
    addChangePart,
    addChangeLabour,
    addChangeInspectionHour,
    addChangeMechanicPercentage,
    addChangeInspectionPercentage,
    removePartById,
    removeLabourById,
    removeInspectionHourById,
    removeMechanicPercentageById,
    removeInspectionPercentageById,
    setUpdateStatusMechanicPercentage,
    setDeleteStatusMechanicPercentage,
    setUpdateStatusInspectionPercentage,
    setDeleteStatusInspectionPercentage,
    setUpdateStatusPart,
    setDeleteStatusPart,
    setUpdateStatusLabour,
    setDeleteStatusLabour,
    setNewInsertInspectionHour,
    setNewInsertMechanicPercentage,
    setNewInsertInspectionPercentage,
    setNewInsertPart,
    setNewInsertLabour,
    addTempPart,
    addTempLabour,
    addTempMechanicPercentage,
    addTempInspectionHour,
    addTempInspectionPercentage,
    removeTempPart,
    removeTempLabour,
    removeALLTempLabour,
    removeTempMechanicPercentage,
    removeTempInspectionHour,
    removeTempInspectionPercentage,
    removeAllTempInspectionItems,
    removeAllTempServiceItems,
    removeAllLabours,
    removeAllTempParts,
    removeAllParts,
    removeAllTotal,
    removeAllInspectionHours,
    removeAllMechanicPercentages,
    removeAllInspectionPercentages,
    removeNewInsertInspectionHour,
    removeInspectionHours,
    addDeferredPart,
    addDeferredTempPart,
    addDeferredLabour,
    addDeferredTempLabour,
    addDeferredInspectionHour,
    addDeferredTempInspectionHour,
    addDeferredMechanicPercentage,
    addDeferredTempMechanicPercentage,
    addDeferredInspectionPercentage,
    addDeferredTempInspectionPercentage,
    addChangeDeferredPart,
    addChangeDeferredLabour,
    addChangeDeferredInspectionHour,
    addChangeDeferredMechanicPercentage,
    addChangeDeferredInspectionPercentage,
    removeDeferredPart,
    removeDeferredTempPart,
    removeDeferredLabour,
    removeDeferredTempLabour,
    removeDeferredInspectionHour,
    removeDeferredTempInspectionHour,
    removeDeferredMechanicPercentage,
    removeDeferredTempMechanicPercentage,
    removeDeferredInspectionPercentage,
    removeDeferredTempInspectionPercentage,
    updateDeferredPart,
    updateDeferredLabour,
    updateDeferredInspectionHour,
    updateDeferredMechanicPercentage,
    updateDeferredInspectionPercentage,
    switchServiceAcceptToDeferred,
    switchServiceDeferredToAccept,
    switchInspectionAcceptToDeferred,
    switchInspectionDeferredToAccept,
    addDeferredInspectionHours,
    addDeferredLabours,
    addDeferredInspectionPercentages,
    addDeferredMechanicPercentages,
    addDeferredParts,
    removeAllInspectionItem,
    updateDeferredTempMechanicPercentage,
    updateTempMechanicPercentage,
    addEstimateTechnician,
    updateDeferredTempInspectionPercentage,
    updateTempInspectionPercentage,
    editTempMechanicPercentage,
    editDeferredTempMechanicPercentage,
    editTempInspectionPercentage,
    editDeferredTempInspectionPercentage,
    setEstimateTechnicianUpdateStatus,
    removeAllEstimateTechnician,
    updateTempPart,
    updateDeferredTempPart,
    updateTempLabour,
    updateTempDeferredLabour
} = serviceInspectionItemSlice.actions;

export default serviceInspectionItemSlice.reducer;
