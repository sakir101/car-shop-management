import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface ContactItem {
  id: string;
}

interface CItemShow {
  ContactState: ContactItem;
}

const initialState: CItemShow = {
  ContactState: {
    id: "",
  },
};

const deleteContactSlice = createSlice({
  name: "deleteContact",
  initialState,
  reducers: {
    addContactItem: (state, action: PayloadAction<ContactItem>) => {
      state.ContactState = action.payload;
    },

    clearContactState: (state) => {
      state.ContactState = { id: "" };
    },
  },
});

export const { addContactItem, clearContactState } = deleteContactSlice.actions;

export default deleteContactSlice.reducer;
