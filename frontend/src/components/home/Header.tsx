import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf } from '../auth/authSlice';
import { fetchAsyncGetBelongToGroup } from './homeSlice';
const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    useEffect(()=>{
        const fetchLoader = async ()=>{
            //ログインしていたら
            if (localStorage.localJWT) {
                const result = await dispatch(fetchAsyncGetMyProf());//ログインしているユーザーのプロフィールを取得する
                //await dispatch(fetchAsyncGetBelongToGroup());
            }else{
                history.push('/')
            }
        };
        fetchLoader();
    },[]);
    return (
        <div>
            
        </div>
    )
}

export default Header
