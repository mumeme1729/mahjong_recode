import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf, selectLoginUserProfile } from '../auth/authSlice';
import { fetchAsyncGetBelongToGroup, resetBackUrl, setBackUrl, setOpenProfile } from './homeSlice';
import styles from "./Home.module.css";
import { Avatar, Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuProps, withStyles } from '@material-ui/core';
import Profile from './Profile';



const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const location = useLocation();
    const loginUserProfile=useSelector(selectLoginUserProfile);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                //await dispatch(fetchAsyncGetBelongToGroup());
                if(location.pathname==='/'){
                    history.push('/home');
                }
            }else{
                if(!location.pathname.includes('/activate')){
                    dispatch(setBackUrl(location.pathname));
                    console.log(location.pathname);
                    history.push('/');
                }
            }
        };
        fetchLoader();
    },[]);

    function logout(){
        localStorage.removeItem("localJWT");
        dispatch(resetBackUrl());
        history.push('/');
    }

    return (
        <>
            {location.pathname!=='/'?
            <div className={styles.header_container}>
                <div className={styles.header_body}>
                    <div className={styles.header_body_left}>
                        <h3>ヘッダー</h3>
                    </div>
                    <div className={styles.header_body_right}>
                        <div>
                            <p>{loginUserProfile.nickName}</p>  
                        </div>
                        <div>
                            <Button
                                onClick={()=>{dispatch(setOpenProfile())}}
                            >
                                <Avatar alt="who?" src={loginUserProfile.img} style={{height:'60px',width:'60px'}}/>
                            </Button>
                        </div>
                        <Profile />
                    </div>
                </div>
            </div>
            :null}
        </>
    )
}

export default Header
