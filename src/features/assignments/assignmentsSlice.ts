import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assignment, CreateAssignmentDto, FilterStatus, FilterState, SortBy } from '../../types';
import { fetchMockAssignments } from './assignmentsApi';

export interface AssignmentsState {
  items: Assignment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: FilterState;
}

const initialFilters: FilterState = { status: FilterStatus.All, priority: null, subject: null, search: '', sortBy: SortBy.CreatedAtDesc, page: 1, itemsPerPage: 3 };
const initialState: AssignmentsState = { items: [], status: 'idle', error: null, filters: initialFilters };

export const fetchAssignments = createAsyncThunk<Assignment[]>('assignments/fetch', async () => {
  const cached = localStorage.getItem('deadline-tracker:v3');
  if (cached) {
    try {
      const cachedAssignments: unknown = JSON.parse(cached);
      if (Array.isArray(cachedAssignments) && cachedAssignments.length > 0) {
        return cachedAssignments as Assignment[];
      }
    } catch {
      localStorage.removeItem('deadline-tracker:v3');
    }
  }
  const response = await fetchMockAssignments();
  return response.data;
});

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    addAssignment(state, action: PayloadAction<CreateAssignmentDto>) {
      const timestamp = new Date().toISOString();
      state.items.unshift({ ...action.payload, id: crypto.randomUUID(), assignedDate: timestamp, isSubmitted: false, submittedAt: null, createdAt: timestamp, updatedAt: timestamp });
    },
    deleteAssignment(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleSubmitted(state, action: PayloadAction<string>) {
      const assignment = state.items.find((item) => item.id === action.payload);
      if (!assignment) return;
      assignment.isSubmitted = !assignment.isSubmitted;
      assignment.submittedAt = assignment.isSubmitted ? new Date().toISOString() : null;
      assignment.updatedAt = new Date().toISOString();
    },
    setFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialFilters;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssignments.pending, (state) => { state.status = 'loading'; state.error = null; });
    builder.addCase(fetchAssignments.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload; });
    builder.addCase(fetchAssignments.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message ?? 'Không thể tải bài tập'; });
  },
});

export const { addAssignment, deleteAssignment, toggleSubmitted, setFilters, resetFilters } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
