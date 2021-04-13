import React from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import {selectOpenSignIn,} from './authSlice';
import SignUp from './SignUp';
import Login from './Login';

const Auth:React.FC = () => {
    const openSignIn = useSelector(selectOpenSignIn); 
    const dispatch: AppDispatch = useDispatch();
    return (
        <>
            {openSignIn
            ?<>
                {/* サインアップ */}
                <SignUp/>
             </>
            :<> 
                {/* サインイン  */}
                <Login/>
            </>}
        </>
    )
}

export default Auth
