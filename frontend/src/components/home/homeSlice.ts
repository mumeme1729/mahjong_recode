import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN,PROPS_CREATE_GROUP} from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//所属しているグループを取得
export const fetchAsyncGetBelongToGroup = createAsyncThunk("belongtogroup/get", async () => {
    const res = await axios.get(`${apiUrl}mahjong/groupmember/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  });

//グループ新規作成
export const fetchAsyncCreateGroup = createAsyncThunk(
    "group/post",
    async (newGroup: PROPS_CREATE_GROUP) => {
      const groupData = new FormData();
      groupData.append("title",newGroup.title);
      newGroup.img && groupData.append("img", newGroup.img, newGroup.img.name);
      const res = await axios.post(`${apiUrl}mahjong/group/`, groupData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }).catch(error => {
        console.log(error.response)
      });
      //return res.data;
    });

export const homeSlice=createSlice({
    name:'home',
    initialState:{
        backUrl:"",
        belongToGroup:[{
            id: 0,
            title: "",
            img:"",
            profile:[
                {
                    id: 0,
                    nickName: "",
                    text:"",
                    userProfile: 0,
                    created_on: "",
                    img: "",
                }
            ],
        }],
    },
    reducers:{
      setBackUrl(state,action){
        state.backUrl=action.payload;
      },
      resetBackUrl(state){
        state.backUrl="";
      }
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncGetBelongToGroup.fulfilled, (state, action) => {
            state.belongToGroup = action.payload;
        });
    },
});

export const {
 setBackUrl,
 resetBackUrl,
} = homeSlice.actions;

export const selectBelongToGroup=(state:RootState)=>state.home.belongToGroup;
export const selectBackUrl=(state:RootState)=>state.home.backUrl;
export default homeSlice.reducer;