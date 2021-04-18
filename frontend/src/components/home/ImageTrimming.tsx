import {IconButton, Slider } from '@material-ui/core'
import React, { useCallback, useState } from 'react'
import Modal from "react-modal";
import Cropper from 'react-easy-crop'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../app/store'
import { resetImageTrimming, selectIsOpenImageTrimming } from './homeSlice'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import styles from "./Home.module.css";
import { render } from 'react-dom';

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:99,
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

const ImageTrimming:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isopenimagetrimming=useSelector(selectIsOpenImageTrimming);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }, []);

  const [imageRef, setImage] = useState<HTMLImageElement | null>(null);
  const [u,setUrl]=useState<string>("");
  const [bloB,setBlob]=useState<Blob|null>(null);
  const [src, setSrc] = useState<any>(null);  

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
        if(event.target.files.length!==0){
            const reader = new FileReader();
            reader.addEventListener("load", () =>{
                setSrc(reader.result);
            });
            reader.readAsDataURL(event.target.files[0]);
        }
    }
}; 


  const handlerEditPicture = () => {
    const fileInput = document.getElementById("editInputImage");
    fileInput?.click();
  };
  return (
        <Modal
            isOpen={isopenimagetrimming}
            onRequestClose={async () => {
                dispatch(resetImageTrimming());
            }}
            style={modalStyle}
            ariaHideApp={false}
        >
            <div className={styles.image_trimming_container}>
                <div className={styles.image_trimming_body}>
                    <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={1 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    />
                    <div>
                        {/* <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        //onChange={(e,zoom) => setZoom(zoom)}
                        classes={{ root: 'slider' }}
                        /> */}
                    </div>
                    <div className={styles.image_tring_select}>
                        <input type="file" id="editInputImage" className={styles.profile_image_icon_input}
                            accept=".jpg,.gif,.png,image/gif,image/jpeg,image/png"
                            onChange={onSelectFile}
                        />
                        <IconButton onClick={handlerEditPicture}>
                            <PhotoLibraryIcon /> 画像を選択
                        </IconButton>    
                    </div>
                </div>
            </div>
        </Modal>
  )
}

export default ImageTrimming
