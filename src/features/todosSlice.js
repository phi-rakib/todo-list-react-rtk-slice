import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  extraReducers: {},
});

export const tudoSelector = (state) => state.todos
export default todosSlice.reducer;
