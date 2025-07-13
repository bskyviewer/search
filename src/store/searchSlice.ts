import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SearchParams } from "./api";

interface SearchState {
  searchParams: SearchParams | null;
}

const initialState: SearchState = {
  searchParams: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParams | null>) => {
      state.searchParams = action.payload;
    },
  },
});

export const { setSearchParams } = searchSlice.actions;

export default searchSlice.reducer;
