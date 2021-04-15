import React,{ useEffect }  from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { PROPS_BELONG_TO_GROUP } from '../types'
import { AppDispatch } from "../../app/store";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncGetGameResults, fetchAsyncGetGroup,selecGroup, selectGameResults } from './groupSlice';
import styles from "./Group.module.css";
import GameResults from './GameResults';
import { Button } from '@material-ui/core';
import { selectLoginUserProfile } from '../auth/authSlice';

const GroupHome:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    const gameresults=useSelector(selectGameResults);
    const loginUserProfile=useSelector(selectLoginUserProfile);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                const fetchresults=await dispatch(fetchAsyncGetGroup(params.id));
                await dispatch(fetchAsyncGetGameResults(params.id));
                //参加していない場合
                if(fetchresults.payload.profile===null){
                    console.log('null')
                    history.push('/home')
                }
                // else if(!fetchresults.payload.profile.some(loginUserProfile)){
                //     console.log(fetchresults.payload.profile)
                //     console.log(loginUserProfile)
                //     history.push('/home')
                // }
            }
        };
        fetchLoader();
    },[]);


    
    return (
        <div className={styles.group_home_container}>
            <div className={styles.group_home_body}>
                <div className={styles.group_home_container_left}>
                    <img src={group.img}/>
                    {group.title}
                    <br/>
                    <div className={styles.group_home_menu}>
                        <Button onClick={()=>{history.push(`/group/${params.id}/game`)}}>
                            対局
                        </Button>
                        <br/>
                        <Button onClick={()=>{}}>
                            メンバー
                        </Button>
                        <br/>
                        <Button onClick={()=>{}}>
                            ランキング
                        </Button>
                        <br/>
                        <Button onClick={()=>{}}>
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
            </div>
        </div>
    )
}

export default GroupHome
