import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN} from '../types'

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

export const homeSlice=createSlice({
    name:'home',
    initialState:{
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
    
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchAsyncGetBelongToGroup.fulfilled, (state, action) => {
            state.belongToGroup = action.payload;
        });
    },
});

export const {
 
} = homeSlice.actions;

export const selectBelongToGroup=(state:RootState)=>state.home.belongToGroup;
export default homeSlice.reducer;