import React,{useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { AppDispatch } from "../../app/store";
import { fetchAsyncGetMyProf } from '../auth/authSlice';
import { fetchAsyncGetBelongToGroup, setBackUrl } from './homeSlice';
const Header:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const location = useLocation();
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
    return (
        <div>
            
        </div>
    )
}

export default Header
