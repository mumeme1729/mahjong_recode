import React,{ useEffect,useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf,selectLoginUserProfile } from '../auth/authSlice';
import {Avatar,Badge,Button} from "@material-ui/core";
import { fetchAsyncGetBelongToGroup, selectBelongToGroup } from './homeSlice';
import BelongToGroupList from './BelongToGroupList';
import styles from "./Home.module.css";
import Search from './Search';

const Home:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const loginUserProfile=useSelector(selectLoginUserProfile);
    const belongtogroup=useSelector(selectBelongToGroup);

    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                await dispatch(fetchAsyncGetBelongToGroup());
                if (fetchAsyncGetMyProf.rejected.match(result)) {
                    history.push('/')
                }
              }
            };
            fetchLoader();
    },[]);

    return (
        <div>
            <div>
            {loginUserProfile.img}
                <Avatar alt="who?" src={loginUserProfile.img} style={{height:'70px',width:'70px'}}/>
            </div>
            <div>
                <p>{loginUserProfile.nickName}</p>  
            </div>
                <Search/>
            <div className={styles.home_grouplist_container}>
                {belongtogroup.map((group)=>(
                    <BelongToGroupList key={group.id} {...group}/>
                ))}
            </div>
        </div>
    )
}

export default Home
