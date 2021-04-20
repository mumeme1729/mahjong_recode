import { IconButton, TextField } from '@material-ui/core'
import React,{useState} from 'react'
import Modal from "react-modal";
import {Avatar,Badge,Button} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import PhotoIcon from '@material-ui/icons/Photo';
import { File } from "../types";
import { AppDispatch } from '../../app/store';
import { fetchAsyncCreateGroup } from './homeSlice';
import { selectLoginUserProfile } from '../auth/authSlice';
import { fetchAsyncCreateRate, fetchAsyncParticipationGroup } from '../group/groupSlice';

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:2,
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

const Search:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [group,setGroup]=useState("");
    const [openModal,setOpenModal]=useState<boolean>(false);
    const [groupName,setGroupName]=useState("")
    const [text,setText]=useState("")
    const [password,setPassword]=useState("")
    const [image, setImage] = useState<File | null>(null);
    const loginuserprofile=useSelector(selectLoginUserProfile);
    
    let url="";
    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    const newGroup = async (e: React.MouseEvent<HTMLElement>) => {
        console.log("サーチ")
        e.preventDefault();
        const packet = { title: groupName,text:text,password:password,img: image,};
        console.log(packet)
        const results=await dispatch(fetchAsyncCreateGroup(packet));
        const group_id=results.payload.id;
        console.log(group_id)
        if(fetchAsyncCreateGroup.fulfilled.match(results)){
            let member:number[]=[]
            member.push(loginuserprofile.userProfile);
            console.log(member)
            const pkt={id:group_id,userGroup:member}
            const results=await dispatch(fetchAsyncParticipationGroup(pkt));
            console.log(fetchAsyncParticipationGroup.fulfilled.match(results))
            if(fetchAsyncParticipationGroup.fulfilled.match(results)){
                console.log("rate")
                const rate_pkt={group_id:group_id,user_id:loginuserprofile.userProfile}
                await dispatch(fetchAsyncCreateRate(rate_pkt));
            }   
        }
        setGroupName("");
        setImage(null);
        setOpenModal(false);
    };

      if(image!==null){
        var binaryData = [];
        binaryData.push(image);
        url=window.URL.createObjectURL(new Blob(binaryData, {type: "image/*"}))
      }
    return (
        <>
            <div>
                <TextField
                    id="group"
                    label="グループ"
                    type="text"
                    fullWidth
                    onChange={(e)=>setGroup(e.target.value)}
                    defaultValue={group}
                />
                <Button variant="contained" color="primary" onClick={()=>setOpenModal(true)}>グループ作成</Button>
            </div>

            <Modal
                isOpen={openModal}
                onRequestClose={()=>{
                    setOpenModal(false);
                    url="";
                    setImage(null);
                }}
                style={modalStyle}
                ariaHideApp={false}
            >
                <form >
                    <h2>グループ作成</h2>
                    <br />
                    <TextField
                        placeholder="グループ名"
                        type="text"
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <br/>
                    <TextField
                        placeholder="紹介文"
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                    />
                    <br/>
                    <TextField
                        placeholder="パスワード"
                        type="text"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="file"
                        id="imageInput"
                        hidden={true}
                        onChange={(e) => setImage(e.target.files![0])}
                    />
                    <br />
                    <IconButton onClick={handlerEditPicture}>
                        <PhotoIcon />
                    </IconButton>
                    <div>
                        {url!==""?<img src={url} height="90px"/>:null}
                    </div>
                    <br />
                    <Button
                        disabled={!groupName}
                        variant="contained"
                        color="primary"
                        onClick={newGroup}
                    >
                        グループを作る
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default Search
