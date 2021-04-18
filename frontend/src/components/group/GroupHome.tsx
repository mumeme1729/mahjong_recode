import React,{ useEffect, useLayoutEffect }  from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { PROPS_BELONG_TO_GROUP } from '../types'
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncGetGameResults, fetchAsyncGetGroup,selecGroup, selectGameResults } from './groupSlice';
import styles from "./Group.module.css";
import GameResults from './GameResults';
import { Button, Modal } from '@material-ui/core';
import { fetchAsyncGetMyProf, selectLoginUserProfile } from '../auth/authSlice';
import { 
    FacebookShareButton, 
    FacebookIcon,
    TwitterShareButton, 
    TwitterIcon,
    LineShareButton,
    LineIcon,
} from 'react-share'
import { ContactlessOutlined, ContactsOutlined } from '@material-ui/icons';

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

const GroupHome:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    const gameresults=useSelector(selectGameResults);
    const loginuserprofile=useSelector(selectLoginUserProfile);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                const fetchresults=await dispatch(fetchAsyncGetGroup(params.id));
                await dispatch(fetchAsyncGetGameResults(params.id));
            }
        };
        fetchLoader();
    },[]);

    const isParti=groupmember.map((gm)=>{
        return gm.userProfile===loginuserprofile.userProfile
    })
    const istrue=isParti.includes(true)
    console.log(istrue)

    return (
        <div className={styles.group_home_container}>
            
            <div className={styles.group_home_body_container}>
                <div className={styles.group_home_body_top}>
                <Button onClick={()=>history.push('/home')}>戻る</Button>
                    <FacebookShareButton url={`http://localhost:8080/group/${params.id}`}>
                        <FacebookIcon  round />
                    </FacebookShareButton>
                    <TwitterShareButton url={`http://localhost:8080/group/${params.id}`}>
                        <TwitterIcon  round />
                    </TwitterShareButton>
                    <LineShareButton url={`http://localhost:8080/group/${params.id}`}>
                        <LineIcon/>
                    </LineShareButton>
                    
                    <br/>
                    <img src={group.img}/>
                    {group.title}
                    <br/>
                </div>

                <div className={styles.group_home_body}>
                    {istrue?
                    <>
                    <div className={styles.group_home_container_left}>
                        
                        <div className={styles.group_home_menu}>
                            <Button onClick={()=>{history.push(`/group/${params.id}/game`)}}>
                                対局
                            </Button>
                            <br/>
                            <Button onClick={()=>{history.push(`/group/${params.id}/member`)}}>
                                メンバー
                            </Button>
                            <br/>
                            <Button onClick={()=>{history.push(`/group/${params.id}/matchrecord`)}}>
                                対局記録
                            </Button>
                        </div>
                    </div>
                    <div className={styles.group_home_container_right}>
                        <div className={styles.group_home_container_right_top}>
                            レート
                        </div>
                        <div className={styles.group_home_container_right_bottom}>
                            <div className={styles.group_home_results}>
                                対局記録
                                {gameresults.length}
                                {gameresults.map((gameresult)=>(
                                    <div key={gameresult.id}>
                                        <GameResults {...gameresult}/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    </>:<div><Button onClick={()=>{}}>グループに参加</Button></div>}
                </div>    
            </div>
        </div>
    )
}

export default GroupHome
