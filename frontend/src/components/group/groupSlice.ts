import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN,PROPS_CREATE_GAME,PROPS_CREATE_GAME_RESLTS,PROPS_CREATE_GROUP, PROPS_RATE} from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//所属しているグループを取得
export const fetchAsyncGetGroup = createAsyncThunk("group/get", async (id:string) => {
    const res = await axios.get(`${apiUrl}mahjong/selectgroupmember/`, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
      },
    });
    return res.data[0];
 });
 //ゲーム結果
 export const fetchAsyncGetGameResults = createAsyncThunk("gameresults/get", async (id:string) => {
  const res = await axios.get(`${apiUrl}mahjong/results/`, {
    headers: {
      Authorization: `JWT ${localStorage.localJWT}`,
    },
    params:{
      group_id:`${id}`,
    },
  });
  return res.data;
});
//ゲーム開始
export const fetchAsyncCreateGame = createAsyncThunk(
  "game/post",
  async (id: PROPS_CREATE_GAME) => {
    const res = await axios.post(`${apiUrl}mahjong/game/`, id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    return res.data;
  }
);
//ゲーム削除
export const fetchAsyncDeleteGame = createAsyncThunk(
  "game/delete",
  async (id: number) => {
    const res = await axios.delete(`${apiUrl}mahjong/game/${id}`,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    return res.data;
  }
);
//スコア記録
export const fetchAsyncCreateGameResults=createAsyncThunk(
  "gameresults/post",
  async (score: PROPS_CREATE_GAME_RESLTS) => {
    const res = await axios.post(`${apiUrl}mahjong/gameresults/`, score, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    return res.data;
  }
);
//レート更新
export const fetchAsyncPutRate=createAsyncThunk(
  "rate/put",
  async(rate_info:PROPS_RATE)=>{
    const res = await axios.put(`${apiUrl}mahjong/rate/${rate_info.rate_id}/`, rate_info, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }).catch(error => {
      console.log(error.response)
    });
    //return res.data;
  }
);

export const groupSlice=createSlice({
    name:'home',
    initialState:{
        group:{
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
                    rate_id:0,
                    group_id:0,
                    user_id: 0,
                    rate: 1500
                }
            ],
        },
        gameresults:[
          {
            id:0,
            group_id:0,
            created_at:"",
            results:[
              {
                id:0,
                game_id:0,
                user_id:0,
                rank:0,
                score:0,
                profile:
                  {
                    id: 0,
                    nickName: "",
                    text:"",
                    userProfile: 0,
                    created_on: "",
                    img: "",
                  }
              },
            ],
          },
        ],
    },
    reducers:{
    
    },
    extraReducers:(builder)=>{
      builder.addCase(fetchAsyncGetGroup.fulfilled, (state, action) => {
        state.group = action.payload;
      });
      builder.addCase(fetchAsyncGetGameResults.fulfilled, (state, action) => {
        state.gameresults = action.payload;
      });
    },
});

export const {
 
} = groupSlice.actions;

export const selecGroup=(state:RootState)=>state.group.group;
export const selectGameResults=(state:RootState)=>state.group.gameresults
export default groupSlice.reducer;