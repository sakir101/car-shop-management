import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IPageReload {
    pageReload: boolean
}

const initialState: IPageReload = {
    pageReload: false
}

const pageReloadSlice = createSlice({
    name: 'pageReload',
    initialState,
    reducers: {
        setPageReload: (state) => {
            state.pageReload = !state.pageReload
        },
    }
})

export const { setPageReload } = pageReloadSlice.actions

export default pageReloadSlice.reducer;