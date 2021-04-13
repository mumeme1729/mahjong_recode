import React,{useState} from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import {Button,TextField} from "@material-ui/core";
import {Link,useHistory} from 'react-router-dom';
import * as Yup from "yup";
import {
    resetOpenSignIn,
    selectOpenSignIn,
    fetchAsyncRegister,
} from './authSlice';
const SignUp:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [sendEmail,setSendEmail]=useState(false);
    const [successCreateAccount,setSuccessCreateAccount]=useState(false);
    const history = useHistory();
    const handleLink = (path: string) => history.push(path);
    return (
        <div　className="auth_container">
            <Formik
                initialErrors={{ email: "required" }}
                initialValues={{ email: "", password: "",password2:"" }}
                
                onSubmit={async (values) => {
                    setSendEmail(true)
                    const auth_packet={email: values.email,password: values.password}
                    console.log(values.email)
                    const resultRegister = await dispatch(fetchAsyncRegister(auth_packet));
                    console.log(resultRegister)
                    //新規作成に成功したらログイン
                    if (fetchAsyncRegister.fulfilled.match(resultRegister)) {
                        setSuccessCreateAccount(false);
                        setSendEmail(true);
                    }else{
                        values.email="";
                        values.password="";
                        values.password2="";
                        setSendEmail(false);
                        setSuccessCreateAccount(true);
                    }   
                }}
                //バリデーション
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                            .email("メールアドレスのフォーマットが不正です。")
                            .required("メールアドレスは必須です。"),
                    password: Yup.string().required("パスワードは必須です。").min(4),
                    password2:Yup.string().required("パスワードは必須です。").oneOf([Yup.ref("password"), null], "Passwords must match")
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
                        {sendEmail
                        ?
                            <div>
                                ご登録いただいたメールアドレスにメールを送信しました。
                                メールより本登録をお願いします。
                            </div>:null}
                        {successCreateAccount
                        ?
                            <div>
                                このメールアドレスは既に登録されています
                            </div>:null}
                        <div className="">
                            <h2>アカウント作成</h2>
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
                                <TextField
                                    placeholder="confirm password"
                                    type="password"
                                    name="password2"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password2}
                                />
                                {touched.password2 && errors.password2 ? (
                                    <div >{errors.password2}</div>
                                    ) : null}
                                <div className="">
                                    <Button variant="contained" color="primary" disabled={!isValid} type="submit">
                                        アカウント作成
                                    </Button>
                                    <div className="">
                                        <span onClick={async () => {
                                            dispatch(resetOpenSignIn());              
                                        }}>
                                            アカウントをお持ちの方はこちら
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

export default SignUp
