import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: Cookies.get("token"),
    refreshData: null,
    fcm: null,
    footer: null,
  },
  reducers: {
    changeUserValues: (state, action) => {
      state.user = action.payload;
    },
    setRefreshData: (state, action) => {
      state.refreshData = action.payload;
    },

    setFcmToken: (state, action) => {
      state.fcm = action.payload;
    },
    setFooterData: (state, action) => {
      state.footer = action.payload;
    },
  },
});

export const { setFcmToken, changeUserValues, setRefreshData, setFooterData } =
  userSlice.actions;
export default userSlice.reducer;
