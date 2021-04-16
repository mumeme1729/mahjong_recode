import { Avatar, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetGameResults, fetchAsyncGetGroup, selecGroup, selectGameResults } from './groupSlice';
import Paper from '@material-ui/core/Paper';
const GroupMember:React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    

    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGroup(params.id));
                
            }
        };
        fetchLoader();
    },[]);

  
    const url='http://127.0.0.1:8000'
    return (
        <div>
            
            {groupmember.map((mem)=>(
                <div key={mem.id}>
                    <div>
                        <div>
                            {mem.img!==""?
                            <Avatar alt="who?" src={url+mem.img} style={{height:'70px',width:'70px'}}/>
                            :null}
                        </div>
                        <div>
                            {mem.nickName}
                            {mem.rate}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GroupMember
