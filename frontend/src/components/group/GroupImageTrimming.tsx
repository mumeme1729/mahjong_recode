import {Button, IconButton, Slider } from '@material-ui/core'
import React, { useCallback, useState } from 'react'
import Modal from "react-modal";
import Cropper from 'react-easy-crop'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../app/store'
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import styles from "../home/Home.module.css";
import { fetchAsyncUpdateGroupImage, resetOpenGroupImageTrimming, selecGroup, selectOpenGroupImageTrimming } from './groupSlice';

const modalStyle={
    overlay: {
        background: 'rgba(0, 0, 0, 0.2)',
        zIndex:100,
      },
    content: {
        
      top: "50%",
      left: "50%",
      backgroundColor: 'white',
      width: 260,
      height: 480,
      transform: "translate(-50%, -50%)",
      },
};

const GroupImageTrimming:React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isopengroupimagetrimming=useSelector(selectOpenGroupImageTrimming);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  //const profile=useSelector(selectLoginUserProfile);
  const group=useSelector(selecGroup);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
    console.log(croppedAreaPixels)
  }, []);

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
//トリミング
const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  });
const getCroppedImg=async(imageSrc: any, pixelCrop: { width: number; height: number; x: number; y: number; }|null)=>{
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    if(pixelCrop!==null){
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height
        if(ctx !== null){
            ctx.drawImage(
                image,
                pixelCrop.x * scaleX,
                pixelCrop.y * scaleY,
                pixelCrop.width * scaleX,
                pixelCrop.height * scaleY,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );
        }
    }
    return new Promise((resolve, reject)=>{
        canvas.toBlob((blob) => {
            if (!blob) {
                console.error("Canvas is empty");
                return;
            }
            resolve(blob)
        }, "image/jpeg");
    });
}

async function updateImage(croppedImage:any){
    const name:string=String(group.id)+String(Date.now())+".jpg";
    if(createImage!==null){
        const newImage=new File([croppedImage],name,{type:"image/jpg",lastModified:Date.now()});
        const packet = { id: group.id,title:group.title,text:group.text,password:group.password,img: newImage,name:name,};
        const results=await dispatch(fetchAsyncUpdateGroupImage(packet)); 
        if(fetchAsyncUpdateGroupImage.fulfilled.match(results)){
            dispatch(resetOpenGroupImageTrimming());
        }
    }  
};

async function showCroppedImage(){
    const croppedImage =  await getCroppedImg(
        src,
        croppedAreaPixels,
    )
    await updateImage(croppedImage);
};

const handlerEditPicture = () => {
    const fileInput = document.getElementById("editInputImage");
    fileInput?.click();
};
  
  return (
        <Modal
            isOpen={isopengroupimagetrimming}
            onRequestClose={async () => {
                dispatch(resetOpenGroupImageTrimming());
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
                    aspect={1.5 / 1.7}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    />
                    <div className={styles.image_tring_select}>
                        <input type="file" id="editInputImage" className={styles.profile_image_icon_input}
                            accept=".jpg,.gif,.png,image/gif,image/jpeg,image/png"
                            onChange={onSelectFile}
                        />
                        <IconButton onClick={handlerEditPicture}>
                            <PhotoLibraryIcon /> 画像を選択
                        </IconButton>    
                        <Button
                            // disabled={!profile?.nickName}
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={showCroppedImage}
                        >
                        適応
                        </Button>
                    </div>
                    <div className={styles.image_slider}>
                        <Slider
                            value={zoom}
                            min={1}
                            max={4}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e,zoom) => {
                                let z=Number(zoom)
                                setZoom(z)
                            }}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default GroupImageTrimming

function selectIsOpenGroupImageTrimming(selectIsOpenGroupImageTrimming: any) {
    throw new Error('Function not implemented.');
}
function resetGroupImageTrimming(): any {
    throw new Error('Function not implemented.');
}

