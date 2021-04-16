import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN, PROPS_PROFILE} from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//新規登録
export const fetchAsyncRegister=createAsyncThunk(
    "auth/register",
    async (auth: PROPS_AUTHEN) => {
        console.log(auth.email)
        console.log(`${apiUrl}mahjong/register/`)
        const res = await axios.post(`${apiUrl}mahjong/register/`, auth, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return res.data;
      }
);

//有効化
export const fetchAsyncActivateUser = createAsyncThunk("activate/get", async (token:string) => {
  const res = await axios.get(`${apiUrl}mahjong/activate/${token}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
});

export const fetchAsyncCreateProf = createAsyncThunk(
  "profile/post",
  async (nickName: PROPS_PROFILE) => {
    const res = await axios.post(`${apiUrl}mahjong/profile/`, nickName, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  }
);

//ログイン
export const fetchAsyncLogin = createAsyncThunk(
    "auth/post",
    async (authen: PROPS_AUTHEN) => {
      const res = await axios.post(`${apiUrl}authen/jwt/create`, authen, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
      //取得に成功したらローカルに保存
    }
);

//ログインしたユーザーのプロフィール
export const fetchAsyncGetMyProf = createAsyncThunk("profile/get", async () => {
  const res = await axios.get(`${apiUrl}mahjong/loginuserprofile/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
  });
  return res.data[0];
});

export const authSlice=createSlice({
    name:'auth',
    initialState:{
      openSignIn: true,
      login_user_profile: {
        id: 0,
        nickName: "",
        text:"",
        userProfile: 0,
        created_on: "",
        img: "",
      },
    },
    reducers:{
      setOpenSignIn(state) {
        state.openSignIn = true;
      },
      resetOpenSignIn(state) {
        state.openSignIn = false;
      },
    },
    extraReducers:(builder)=>{
        //ログインが成功したらjwtをローカルに保存
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
            localStorage.setItem("localJWT", action.payload.access);
        });
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
          state.login_user_profile = action.payload;
        });     
    },
});

export const {
  setOpenSignIn,
  resetOpenSignIn,
} = authSlice.actions;

export const selectLoginUserProfile = (state: RootState) => state.auth.login_user_profile;
export const selectOpenSignIn=(state:RootState)=>state.auth.openSignIn;
export default authSlice.reducer;