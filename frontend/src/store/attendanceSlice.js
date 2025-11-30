import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (notes, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkin', { notes });
      return response.data.attendance;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (notes, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/checkout', { notes });
      return response.data.attendance;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getTodayStatus = createAsyncThunk(
  'attendance/getTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/today');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMyHistory = createAsyncThunk(
  'attendance/getMyHistory',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my-history', {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getMySummary = createAsyncThunk(
  'attendance/getMySummary',
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance/my-summary', {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    today: null,
    history: [],
    summary: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(checkIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.loading = false;
        state.today = action.payload;
      })
      .addCase(checkOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getTodayStatus.fulfilled, (state, action) => {
        state.today = action.payload;
      })
      .addCase(getMyHistory.fulfilled, (state, action) => {
        state.history = action.payload.attendance;
      })
      .addCase(getMySummary.fulfilled, (state, action) => {
        state.summary = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
