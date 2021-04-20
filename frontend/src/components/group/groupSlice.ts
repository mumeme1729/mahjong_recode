import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {PROPS_AUTHEN,PROPS_CREATE_GAME,PROPS_CREATE_GAME_RESLTS,PROPS_CREATE_GROUP, PROPS_CREATE_RATE, PROPS_PARTICIPATION, PROPS_RATE, PROPS_UPDATE_GROUP, PROPS_UPDATE_GROUP_IMAGE} from '../types'

const apiUrl = process.env.REACT_APP_DEV_API_URL;

//グループに参加
export const fetchAsyncParticipationGroup=createAsyncThunk(
  "group/patch",
  async(participations:PROPS_PARTICIPATION)=>{
    const uploadData = new FormData();
    participations.userGroup.forEach((member)=>{
      uploadData.append("userGroup", String(member));
    })
    const res = await axios.patch(`${apiUrl}mahjong/group/${participations.id}/`,uploadData ,{
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }).catch(error => {
      console.log(error.response)
    });
    
  });
//レート作成
export const fetchAsyncCreateRate = createAsyncThunk(
  "rate/post",
  async (rate:PROPS_CREATE_RATE) => {
    const res = await axios.post(`${apiUrl}mahjong/rate/`, rate, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    })
    .catch(error => {
      console.log(error.response)
    });
  }
);

//所属しているグループを取得
export const fetchAsyncGetGroup = createAsyncThunk("group/get", async (id:string) => {
    const res = await axios.get(`${apiUrl}mahjong/selectgroupmember/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
      params:{
        id:`${id}`,
      },
    });
    return res.data[0];
 });
 //グループ更新
 export const fetchAsyncUpdateGroup = createAsyncThunk(
  "groupinfo/patch",
  async (group:PROPS_UPDATE_GROUP) => {
    const res = await axios.patch(
      `${apiUrl}mahjong/group/${group.id}/`,
      group,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    return res.data;
  }
);
export const fetchAsyncUpdateGroupImage = createAsyncThunk(
  "groupimage/patch",
  async (groupimage:PROPS_UPDATE_GROUP_IMAGE ) => {
    const uploadData = new FormData();
    uploadData.append("title", groupimage.title);
    uploadData.append("text", groupimage.text);
    uploadData.append("password",groupimage.password);
    groupimage.img &&uploadData.append("img",groupimage.img,groupimage.name);
    const res = await axios.patch(
      `${apiUrl}mahjong/group/${groupimage.id}/`,
      uploadData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    )
    return res.data;
  }
);
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
      isOpenSettings:false,
      isopengroupimagetrimming:false,
        group:{
            id: 0,
            title: "",
            text:"",
            password:"",
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
      setOpenSettings(state) {
        state.isOpenSettings = true;
      },
      resetOpenSettings(state) {
        state.isOpenSettings = false;
      },
      setOpenGroupImageTrimming(state) {
        state.isopengroupimagetrimming = true;
      },
      resetOpenGroupImageTrimming(state) {
        state.isopengroupimagetrimming = false;
      },
    },
    extraReducers:(builder)=>{
      builder.addCase(fetchAsyncGetGroup.fulfilled, (state, action) => {
        state.group = action.payload;
      });
      builder.addCase(fetchAsyncGetGameResults.fulfilled, (state, action) => {
        state.gameresults = action.payload;
      });
      builder.addCase(fetchAsyncUpdateGroupImage.fulfilled, (state, action) => {
        state.group.img = action.payload.img;
        state.group.title = action.payload.title;
        state.group.text=action.payload.text;
        state.group.password=action.payload.password;
      });
      builder.addCase(fetchAsyncUpdateGroup.fulfilled, (state, action) => {
        console.log(action.payload)
        state.group.title = action.payload.title;
        state.group.text=action.payload.text;
        state.group.password=action.payload.password;
      });
    },
});

export const {
 setOpenSettings,
 resetOpenSettings,
 setOpenGroupImageTrimming,
 resetOpenGroupImageTrimming,
} = groupSlice.actions;

export const selecGroup=(state:RootState)=>state.group.group;
export const selectGameResults=(state:RootState)=>state.group.gameresults;
export const selectOpenSettings=(state:RootState)=>state.group.isOpenSettings;
export const selectOpenGroupImageTrimming=(state:RootState)=>state.group.isopengroupimagetrimming;
export default groupSlice.reducer;