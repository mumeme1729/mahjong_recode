import { Button, TextField } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncActivateUser, fetchAsyncCreateProf, fetchAsyncGetMyProf, fetchAsyncLogin } from './authSlice';
import * as Yup from "yup";
import { resetBackUrl, selectBackUrl } from '../home/homeSlice';

const Activate:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ token: string }>();
    const backurl=useSelector(selectBackUrl);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            console.log(params.token)
            if(params.token!==""){
              const result=  await dispatch(fetchAsyncActivateUser(params.token));   
            }
        };
        fetchLoader();
    },[]);
    return (

        <div　className="auth_container">
            登録が完了しました。以下のログインフォームよりログインしてください
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: ""}}

                onSubmit={async (values) => {
                    const result = await dispatch(fetchAsyncLogin(values));
                    if (fetchAsyncLogin.fulfilled.match(result)) {
                        const res=await dispatch(fetchAsyncCreateProf({ nickName: "no name"}));
                        if(fetchAsyncCreateProf.fulfilled.match(res)){
                            console.log(backurl);
                            console.log("ラスト")
                            if(backurl===""){
                                history.push('/home');
                            }else{
                                history.push(backurl);
                                dispatch(resetBackUrl());
                            }
                        }
                    }else{
                        values.email="";
                        values.password="";
                    }   
                }}
                //バリデーション
                validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email("メールアドレスのフォーマットが不正です。")
                    .required("メールアドレスは必須です。"),
                password: Yup.string().required("パスワードは必須です。").min(4),
                })}
            >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isValid,
            }) => (
                    <div className="auth_login_main_container">
                        {/* <div className="css_styles.auth_progress">
                            {isLoadingAuth && <CircularProgress />}
                        </div> */}

                        <div className="">
                            <h2>ログイン</h2>
                        </div>
                    
                        <form onSubmit={handleSubmit}>
                            <div >
                                <TextField
                                    placeholder="email"
                                    type="input"
                                    name="email"
                                    onChange={handleChange}//formikのバリデーションを走らせる
                                    onBlur={handleBlur}//マウスが外れた時に走らせる
                                    value={values.email}
                                />
                                <br />
                                {touched.email && errors.email ? (
                                <div >{errors.email}</div>
                                ) : null}
                                <br />
                                <TextField
                                    placeholder="password"
                                    type="password"
                                    name="password"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                />
                                {touched.password && errors.password ? (
                                <div >{errors.password}</div>
                                ) : null}
                                <br />
                                <br/>
                                
                                <div className="">
                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">ログイン</Button>
                                    
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Activate
function dispatch(arg0: any) {
    throw new Error('Function not implemented.');
}

