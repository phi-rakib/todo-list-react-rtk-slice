import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import axios from "axios";

export const initialState = {
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
  try {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/todos"
    );
    return response.data;
  } catch (error) {
    throw Error(error);
  }
});

export const createTodo = createAsyncThunk("todo/createTodo", async (todo) => {
  try {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/todos",
      todo
    );
    return response.data;
  } catch (error) {
    throw Error(error);
  }
});

export const todoDelete = createAsyncThunk("todo/todoDelete", async (id) => {
  try {
    await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
    return id;
  } catch (error) {
    throw Error(error);
  }
});

export const todoComplete = createAsyncThunk(
  "todo/todoComplete",
  async (todo) => {
    try {
      await axios.put(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        todo
      );
      return todo;
    } catch (error) {
      throw Error(error);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, { payload }) => {
        state.todos = payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, { payload }) => {
        state.todos = [];
        state.loading = false;
        state.error = payload;
      })
      .addCase(createTodo.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos.unshift(payload);
      })
      .addCase(todoDelete.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== payload);
      })
      .addCase(todoComplete.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.todos = state.todos.map((todo) =>
          todo.id === payload.id ? { ...todo, ...payload } : todo
        );
      })
      .addMatcher(
        isAnyOf(
          fetchTodos.pending,
          createTodo.pending,
          todoDelete.pending,
          todoComplete.pending
        ),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchTodos.rejected,
          createTodo.rejected,
          todoDelete.rejected,
          todoComplete.rejected
        ),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export const todosSelector = (state) => state.todos;

export default todosSlice.reducer;
