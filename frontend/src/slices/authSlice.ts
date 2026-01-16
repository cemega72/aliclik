import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, ApiError } from '../lib/api';

export type User = { id: number; email: string; name?: string | null };

type State = {
  user: User | null;
  loading: boolean;
  error?: string;
  initialized: boolean;
};

const initialState: State = { user: null, loading: false, initialized: false };

export const loadMe = createAsyncThunk<User, void, { rejectValue: string }>('auth/loadMe', async (_, { rejectWithValue }) => {
  try {
    const data = await apiFetch<{ user: User }>('/auth/me');
    return data.user;
  } catch (e) {
    const err = e as ApiError;
    // 401 means not authenticated; not a hard error
    if (err.status === 401) return rejectWithValue('UNAUTH');
    return rejectWithValue(err.message);
  }
});

export const login = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiFetch<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data.user;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const register = createAsyncThunk<User, { email: string; password: string; name?: string }, { rejectValue: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiFetch<{ user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return data.user;
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const logout = createAsyncThunk<void>('auth/logout', async () => {
  await apiFetch('/auth/logout', { method: 'POST' });
});

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadMe.pending, (s) => {
      s.loading = true;
      s.error = undefined;
    })
      .addCase(loadMe.fulfilled, (s, a) => {
        s.user = a.payload;
        s.loading = false;
        s.initialized = true;
      })
      .addCase(loadMe.rejected, (s, a) => {
        s.loading = false;
        s.initialized = true;
        if (a.payload && a.payload !== 'UNAUTH') s.error = a.payload;
        if (a.payload === 'UNAUTH') s.user = null;
      })
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.user = a.payload;
        s.loading = false;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Login failed';
      })
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.user = a.payload;
        s.loading = false;
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Register failed';
      })
      .addCase(logout.fulfilled, (s) => {
        s.user = null;
      });
  },
});

export default slice.reducer;
