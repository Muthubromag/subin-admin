import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const userSlice = createSlice({
  name: "userSlice",
  initialState: { user: Cookies.get("token"), refreshData: null },
  reducers: {
    changeUserValues: (state, action) => {
      state.user = action.payload;
    },
    setRefreshData: (state, action) => {
      state.refreshData = action.payload;
    },
  },
});

export const { changeUserValues, setRefreshData } = userSlice.actions;
export default userSlice.reducer;
