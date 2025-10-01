import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SentencesState {
  searchQuery: string;
  searchInput: string;
  statusFilter: number | undefined;
  currentPage: number;
}

const initialState: SentencesState = {
  searchQuery: '',
  searchInput: '',
  statusFilter: undefined,
  currentPage: 1,
};

const sentencesSlice = createSlice({
  name: 'sentences',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<number | undefined>) => {
      state.statusFilter = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.searchInput = '';
      state.statusFilter = undefined;
      state.currentPage = 1;
    },
  },
});

export const { 
  setSearchQuery, 
  setSearchInput, 
  setStatusFilter, 
  setCurrentPage, 
  resetFilters 
} = sentencesSlice.actions;

export default sentencesSlice.reducer;
