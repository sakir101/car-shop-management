import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Vehicle {
    id: string;
    numberPlate: string;
    model: string;
    color: string;
}

interface Owner {
    name: string;
    contactNum: string;
}

interface SelectedCar {
    vehicle: Vehicle;
    owner: Owner;
    ownerId: string;
    
}

interface IGroupInfo {
    userId: string;
    vehicleId: string;
    selectedCar: SelectedCar | null;
}

const initialState: IGroupInfo = {
    userId: "",
    vehicleId: "",
    selectedCar: null,
};

const carSlice = createSlice({
    name: "carGroupInfo",
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<string | "">) => {
            state.userId = action.payload;
        },
        setVehicleId: (state, action: PayloadAction<string | "">) => {
            state.vehicleId = action.payload;
        },
        setSelectedCar: (state, action: PayloadAction<SelectedCar | null>) => {
            state.selectedCar = action.payload;
            if (action.payload) {
                state.userId = action.payload.ownerId;
                state.vehicleId = action.payload.vehicle.id;
            } else {
                state.userId = "";
                state.vehicleId = "";
            }
        },
        removeSelectedCar: (state) => {
            state.selectedCar = null;
        }
    },
});

export const { setUserId, setVehicleId, setSelectedCar, removeSelectedCar } = carSlice.actions;

export default carSlice.reducer;
