import { Avatar, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import Modal from "react-modal";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncUpdateProf, selectLoginUserProfile } from '../auth/authSlice';
import { resetBackUrl, resetOpenProfile, selectIsOpenProfile, setImageTrimming } from './homeSlice';
import ImageTrimming from './ImageTrimming';

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:8,
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
const Profile:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const isopenprofile=useSelector(selectIsOpenProfile);
    const profile=useSelector(selectLoginUserProfile);
    const [name,setName]=useState(profile.nickName);
    const [text,setText]=useState(profile.text);
    const history = useHistory();
    
    const updateProfile = async () => {
        const packet = { id: profile.id, nickName: name,text:text};
        await dispatch(fetchAsyncUpdateProf(packet));   
        dispatch(resetOpenProfile());
    };
    function logout(){
        localStorage.removeItem("localJWT");
        dispatch(resetBackUrl());
        dispatch(resetOpenProfile());
        history.push('/');
    }
    return (
        <Modal
            isOpen={isopenprofile}
            onRequestClose={async () => {
                dispatch(resetOpenProfile());
            }}
            style={modalStyle}
            ariaHideApp={false}
            >
            <div>
                
                    <h2>プロフィールを編集</h2>
                    <div>
                        <Button onClick={()=>{dispatch(setImageTrimming())}}>
                            <Avatar alt="who?" src={profile.img} style={{height:'70px',width:'70px'}}/>
                        </Button>
                        <ImageTrimming/>
                        <div>
                            <TextField placeholder="名前" type="text" defaultValue={profile.nickName} label="名前"
                                onChange={(e) => setName(e.target.value)}/>
                        </div>
                    </div>
                    <br />
                    <TextField placeholder="自己紹介" type="text" defaultValue={profile.text} multiline fullWidth label="自己紹介"
                        onChange={(event) => setText(event.target.value)}/>
                    <br />
                    <br />
                    
                    <div>
                        <Button
                            disabled={!name}
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={updateProfile}
                        >
                            プロフィール更新
                        </Button>
                    </div>
                
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={logout}
                    >
                        ログアウト
                    </Button>
                </div>
            </div> 
        </Modal>
    )
}

export default Profile
