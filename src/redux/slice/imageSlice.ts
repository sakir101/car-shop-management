import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IImageUrl {
    imageUrl: string | null,
    role:string
}

const initialState: IImageUrl = {
    imageUrl: null,
    role:"initial"
}

const imageUrlSlice = createSlice({
    name: 'imageUrl',
    initialState,
    reducers: {
        setImageUrl: (state, action: PayloadAction<string | null>) => {
            state.imageUrl = action.payload
        },
        setRole: (state, action: PayloadAction<string>) => {
            state.role = action.payload
        },
    }
})

export const { setImageUrl,setRole } = imageUrlSlice.actions

export default imageUrlSlice.reducer;