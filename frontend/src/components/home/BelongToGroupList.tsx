import { Avatar, Button, CardActionArea, createMuiTheme, makeStyles, MuiThemeProvider, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectLoginUserProfile } from '../auth/authSlice';
import {PROPS_BELONG_TO_GROUP} from '../types';
import styles from "./Home.module.css";


const BelongToGroupList:React.FC<PROPS_BELONG_TO_GROUP> = (group) => {
    const loginUserProfile=useSelector(selectLoginUserProfile);
    const history = useHistory();
    return (
        <>
            <Button onClick={()=>{history.push(`/group/${group.id}`)}}> 
                <div className={styles.belong_to_group_container}>
                    <div className={styles.belong_to_group_body_top}>
                        <img src={group.img} className={styles.belong_to_group_img}/>
                    </div>
                    <div className={styles.belong_to_group_body_bottom}>
                        <h3 className={styles.belong_to_group_h3}>{group.title}</h3>
                    </div>    
                </div>
            </Button>
        </>
    )
}

export default BelongToGroupList
