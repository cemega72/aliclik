import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../lib/api';

export type UserRow = { id: number; email: string; name?: string | null; createdAt: string; updatedAt: string };

type State = {
  rows: UserRow[];
  loading: boolean;
  error?: string;
};

const initialState: State = { rows: [], loading: false };

export const fetchUsers = createAsyncThunk<UserRow[], void, { rejectValue: string }>('users/fetch', async (_, { rejectWithValue }) => {
  try {
    return await apiFetch<UserRow[]>('/users');
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

export const createUser = createAsyncThunk<UserRow, { email: string; password: string; name?: string }, { rejectValue: string }>(
  'users/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiFetch<UserRow>('/users', { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const updateUser = createAsyncThunk<UserRow, { id: number; email?: string; password?: string; name?: string }, { rejectValue: string }>(
  'users/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await apiFetch<UserRow>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } catch (e) {
      return rejectWithValue((e as Error).message);
    }
  },
);

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>('users/delete', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/users/${id}`, { method: 'DELETE' });
    return id;
  } catch (e) {
    return rejectWithValue((e as Error).message);
  }
});

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => {
      s.loading = true;
      s.error = undefined;
    })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.rows = a.payload;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? 'Failed to load users';
      })
      .addCase(createUser.fulfilled, (s, a) => {
        s.rows = [a.payload, ...s.rows];
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.rows = s.rows.map((r) => (r.id === a.payload.id ? a.payload : r));
      })
      .addCase(deleteUser.fulfilled, (s, a) => {
        s.rows = s.rows.filter((r) => r.id !== a.payload);
      });
  },
});

export default slice.reducer;
