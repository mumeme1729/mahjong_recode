import React,{ useEffect, useLayoutEffect, useState }  from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { PROPS_BELONG_TO_GROUP } from '../types'
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncCreateRate, fetchAsyncGetGameResults, fetchAsyncGetGroup,fetchAsyncParticipationGroup,selecGroup, selectGameResults, setOpenSettings } from './groupSlice';
import styles from "./Group.module.css";
import GameResults from './GameResults';
import { Button, TextField,} from '@material-ui/core';
import { fetchAsyncGetMyProf, selectLoginUserProfile } from '../auth/authSlice';
import { 
    FacebookShareButton, 
    FacebookIcon,
    TwitterShareButton, 
    TwitterIcon,
    LineShareButton,
    LineIcon,
} from 'react-share'
import Modal from "react-modal";
import GroupSettings from './GroupSettings';

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
    const [istrue,setIsTrue]=useState(false);
    const [password,setPassword]=useState("");
    const [isopenpasswordwindow,setIsOpenPasswordWindow]=useState(false);
    const [notmatchpass,setNotMatchPass]=useState(false);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                const results=await dispatch(fetchAsyncGetGroup(params.id));
                if(fetchAsyncGetGroup.fulfilled.match(results)){
                    const member:{
                        id: number;
                        nickName: string;
                        text: string;
                        userProfile: number;
                        created_on: string;
                        img: string;
                        rate_id: number;
                        group_id: number;
                        user_id: number;
                        rate: number;
                    }[]=results.payload.profile
                    const profileresults=await dispatch(fetchAsyncGetMyProf());
                    if(fetchAsyncGetMyProf.fulfilled.match(profileresults)){
                        const profile: {
                            id: number;
                            nickName: string;
                            text: string;
                            userProfile: number;
                            created_at: string;
                            img: string;
                        }=profileresults.payload;
                        const isParti=member.map((m)=>{
                            return m.userProfile===profile.userProfile
                        })
                        setIsTrue(isParti.includes(true))
                    }
                }
                await dispatch(fetchAsyncGetGameResults(params.id));
            }
        };
        fetchLoader();
    },[]);

    
    //グループに参加
    const participationGroup=async()=>{
        if(group.password==="" || group.password===null){
            let member:number[]=[]
            console.log(groupmember)
            groupmember.forEach((gm)=>{
                member.push(gm.user_id);
            })
            console.log("参加")
            console.log(member)
            member.push(loginuserprofile.userProfile);
            console.log(loginuserprofile.userProfile);
            console.log(member)
            const pkt={id:group.id,userGroup:member}
            const results=await dispatch(fetchAsyncParticipationGroup(pkt));
            if(fetchAsyncParticipationGroup.fulfilled.match(results)){
                const rate_pkt={group_id:group.id,user_id:loginuserprofile.userProfile}
                await dispatch(fetchAsyncCreateRate(rate_pkt));
            }
            setIsTrue(true);
            
        }else{
            console.log(group.password)
            setIsOpenPasswordWindow(true);
        }
    }
    const participationGroupWithPassword=async()=>{
        if (password===group.password){
            let member:number[]=[]
            groupmember.forEach((gm)=>{
                member.push(gm.userProfile);
            })
            member.push(loginuserprofile.userProfile);
            const pkt={id:group.id,userGroup:member}
            const results=await dispatch(fetchAsyncParticipationGroup(pkt));
            if(fetchAsyncParticipationGroup.fulfilled.match(results)){
                const rate_pkt={group_id:group.id,user_id:loginuserprofile.userProfile}
                await dispatch(fetchAsyncCreateRate(rate_pkt));
            }
            setIsTrue(true);
            setNotMatchPass(false);
            setPassword("");
            setIsOpenPasswordWindow(false);
            console.log(istrue)
        }else{
            setNotMatchPass(true);
            setPassword("");
        }
    }

    return (
        <>
            <GroupSettings/>
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
                        <img src={group.img} width="200px" height="220px"/>
                        {group.title}
                        {group.text}
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
                                <br/>
                                <Button onClick={()=>{dispatch(setOpenSettings())}}>設定</Button>
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
                        </>:<div><Button onClick={()=>{participationGroup()}}>グループに参加</Button></div>}
                    </div>    
                </div>
            </div>
            <Modal
            isOpen={isopenpasswordwindow}
            onRequestClose={()=>{
                setIsOpenPasswordWindow(false);
            }}
            style={modalStyle}
            ariaHideApp={false}
            >
                {notmatchpass && <div>パスワードが一致しません</div>}
                <TextField
                    placeholder="パスワード"
                    type="text"
                    defaultValue={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    // disabled={password!==group.password}
                    variant="contained"
                    color="primary"
                    onClick={()=>{participationGroupWithPassword()}}
                >
                    グループに参加
                </Button>
            </Modal>
        </>
    )
}

export default GroupHome
