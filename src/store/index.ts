import { configureStore } from '@reduxjs/toolkit';
import sentencesReducer from './slices/sentencesSlice';

export const store = configureStore({
  reducer: {
    sentences: sentencesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
