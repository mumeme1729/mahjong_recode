import React,{useState} from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import {Button,TextField} from "@material-ui/core";
import {Link,useHistory} from 'react-router-dom';
import * as Yup from "yup";
import {
    setOpenSignIn,
    fetchAsyncLogin,
} from './authSlice';

const Login:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [sendEmail,setSendEmail]=useState(false);
    const [successCreateAccount,setSuccessCreateAccount]=useState(false);
    const history = useHistory();
    return (
        <div　className="auth_container">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: ""}}                
                onSubmit={async (values) => {
                    // dispatch(startAuthLoad());
                    const result = await dispatch(fetchAsyncLogin(values));
                    
                    if (fetchAsyncLogin.fulfilled.match(result)) {
                        history.push('/home')
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
                                    <div className="">
                                        <span onClick={async () => {
                                            dispatch(setOpenSignIn());              
                                        }}>
                                            アカウントをお持ちでない方はこちら
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </Formik>
        </div>
    )
}

export default Login
