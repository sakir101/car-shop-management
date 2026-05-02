import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ISearch {
    searchTerm: string
}

const initialState: ISearch = {
    searchTerm: ""
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload
        },
    }
})

export const { setSearchTerm } = searchSlice.actions

export default searchSlice.reducer;