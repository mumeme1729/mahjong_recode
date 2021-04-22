import React, { useState } from 'react'
import Modal from "react-modal";
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncUpdateGroup, resetOpenSettings, selecGroup, selectOpenGroupImageTrimming, selectOpenSettings, setOpenGroupImageTrimming } from './groupSlice';
import { Button, IconButton, TextField } from '@material-ui/core';
import GroupImageTrimming from './GroupImageTrimming';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:4,
      },
    content: {
        
        top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 450,
      transform: "translate(-50%, -50%)",
      },
};

const GroupSettings:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isopensettings=useSelector(selectOpenSettings);
    const group=useSelector(selecGroup);
    const [title,setTitle]=useState("");
    const [text,setText]=useState("");
    const [password,setPassword]=useState("")

    const updateGroup = async () => {
        let updateTitle=title;
        let updateText=text;
        let updatePassword=password;
        if(updateTitle===""){updateTitle=group.title}
        if(updateText===""){updateText=group.text}
        if(updatePassword===""){updatePassword=group.password}
        console.log(updateTitle)
        const packet = { id: group.id, title:updateTitle,text:updateText,password:updatePassword};
        console.log(packet)
        await dispatch(fetchAsyncUpdateGroup(packet));   
        dispatch(resetOpenSettings());
    };
    
    return (
        <Modal
            isOpen={isopensettings}
            onRequestClose={()=>{
                dispatch(resetOpenSettings());
            }}
            style={modalStyle}
            ariaHideApp={false}
        >   
            {group.img!==null?
                <img src={group.img} onClick={()=>{dispatch(setOpenGroupImageTrimming())}} width="170px" height="190px" />
            :
            <IconButton onClick={()=>{dispatch(setOpenGroupImageTrimming())}}>
                <PhotoLibraryIcon /> 画像を選択
            </IconButton>}
            <GroupImageTrimming/>
            <br/>
            <div>
                {title}
                <TextField placeholder="名前" type="text" defaultValue={group.title} label="グループ名" 
                    onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <br />
                <TextField placeholder="紹介" type="text" defaultValue={group.text} multiline fullWidth label="紹介"
                    onChange={(event) => setText(event.target.value)}/>
            <br />
            <br />
                <TextField placeholder="パスワード" type="text" defaultValue={group.password} multiline fullWidth label="パスワード"
                    onChange={(event) => setPassword(event.target.value)}/>
            <br />
            <Button
                variant="contained"
                color="primary"
                type="submit"
                onClick={updateGroup}
            >
                更新
            </Button>

        </Modal>
    )
}

export default GroupSettings
