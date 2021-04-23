
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { PROPS_GAME_RESULTS } from '../types'
import { fetchAsyncDeleteGame, fetchAsyncPutRate, selecGroup, selectGameResults } from './groupSlice';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import styles from "./Group.module.css";
import { TableRow } from '@material-ui/core';

const GameResults:React.FC<PROPS_GAME_RESULTS> = (gameresults) => {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    let results=gameresults.results;
    const allgameresults=useSelector(selectGameResults);

    
    function rateInfo(){
        let rateinfo:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
        groupmember.map((gm)=>{
            const rate={rate_id:gm.rate_id,group_id:gm.group_id,user_id:gm.user_id,rate:1500}
            rateinfo.push(rate)
        })
        return rateinfo
    }
    const deletegame=async(id:number)=>{
        //レート情報ぶっこ抜き
        let rate=rateInfo()//1500に初期化
        console.log(rate)
        //レート更新
        allgameresults.map((all)=>{
            let gameRate:{rate_id:number,group_id:number,user_id:number,rate:number}[]=[];
            let ratesum=0;
            
            all.results.map((ar)=>{
                if(ar.game_id!==id){
                    const rm=rate.filter((r)=>{
                        return r.user_id===ar.user_id
                    })[0];
                    console.log(rm)
                    ratesum+=rm.rate;
                    gameRate.push(rm);
                }
            })
            
            if(gameRate.length!==0){
                let rateave=Math.round(ratesum/4);//レートの平均
                //レート更新
                let i=1;
                gameRate.map((r)=>{
                    if(i===1){r.rate=Math.round(r.rate+(50+((rateave-r.rate)/70)*0.2));}
                    if(i===2){r.rate=Math.round(r.rate+(10+((rateave-r.rate)/70)*0.2));}
                    if(i===3){r.rate=Math.round(r.rate+(-20+((rateave-r.rate)/70)*0.2));}
                    if(i===4){r.rate=Math.round(r.rate+(-40+((rateave-r.rate)/70)*0.2));}
                    console.log(i)
                    console.log(r.rate)
                    i+=1;
                });
            }
        })
    rate.map(async(r)=>{
        await dispatch(fetchAsyncPutRate(r));
    });
    await dispatch(fetchAsyncDeleteGame(id));
    // history.push(`/group/${params.id}`)
    }
    
    return (
        <>
            {/* <TableRow className={styles.gameresult_container}> */}
                {results.map((result=>(
                    <TableCell component="th" scope="row" key={result.id}  ><p className={styles.results_table_p}>{result.score}</p> <p className={styles.results_table_p}>{result.profile.nickName}</p></TableCell> 
                )))}
            {/* </TableRow> */}
        </>
    )
}

export default GameResults
