import { IconButton, TextField } from '@material-ui/core'
import React,{useState} from 'react'
import Modal from "react-modal";
import {Avatar,Badge,Button} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import PhotoIcon from '@material-ui/icons/Photo';
import { File } from "../types";
import { AppDispatch } from '../../app/store';
import { fetchAsyncCreateGroup } from './homeSlice';

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
    const [image, setImage] = useState<File | null>(null);

    let url="";
    const handlerEditPicture = () => {
        const fileInput = document.getElementById("imageInput");
        fileInput?.click();
    };

    const newGroup = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        const packet = { title: groupName, img: image,};
        const results=await dispatch(fetchAsyncCreateGroup(packet));
        console.log(results.payload)
        setGroupName("");
        setImage(null);
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
