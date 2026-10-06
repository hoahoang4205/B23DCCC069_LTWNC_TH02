import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import assignmentsReducer from '../features/assignments/assignmentsSlice';

export const store = configureStore({
	reducer: { assignments: assignmentsReducer },
	middleware: (getDefaultMiddleware) => {
		const base = getDefaultMiddleware();
		return import.meta.env.DEV ? base.concat(logger) : base;
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
