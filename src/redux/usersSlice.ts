/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store.ts";

interface User {
  id: string;
  email: string;
  last_seen: string;
  name: string;
  role: string;
  status: string;
}

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.user?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const data = await response.json();
      // console.log({ users: data.users });
      return { users: data.users };
    } catch (error) {
      console.error("Fetch error:", error);
      return rejectWithValue("Failed to fetch users");
    }
  }
);

export const blockUsers = createAsyncThunk(
  "users/blockUsers",
  async (userIds: string[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.user?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users/block",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to block users");
      }

      const data = await response.json();
      return { success: true, userIds: data.userIds };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return rejectWithValue("Failed to block users");
    }
  }
);

export const unblockUsers = createAsyncThunk(
  "users/unblockUsers",
  async (userIds: string[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.user?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users/unblock",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to unblock users");
      }

      const data = await response.json();
      return { success: true, userIds: data.userIds };
    } catch (error) {
      return rejectWithValue("Failed to unblock users");
    }
  }
);

export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (userIds: string[], { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.user?.token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete users");
      }

      const data = await response.json();
      return { success: true, userIds: data.userIds };
    } catch (error) {
      return rejectWithValue("Failed to delete users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (
    userData: {
      email: string;
      name: string;
      password: string;
      role: string;
      status: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create user");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue("Failed to create user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(blockUsers.fulfilled, (state, action) => {
        const userIds = action.payload.userIds;
        state.users = state.users.map((user) =>
          userIds.includes(user.id) ? { ...user, status: "blocked" } : user
        );
      })
      .addCase(unblockUsers.fulfilled, (state, action) => {
        const userIds = action.payload.userIds;
        state.users = state.users.map((user) =>
          userIds.includes(user.id) ? { ...user, status: "active" } : user
        );
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        const userIds = action.payload.userIds;
        state.users = state.users.filter((user) => !userIds.includes(user.id));
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersSlice.reducer;
