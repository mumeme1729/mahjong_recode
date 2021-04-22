import { Button, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import GameResults from './GameResults';
import { fetchAsyncGetGameResults, selectGameResults } from './groupSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';



const MatchRecord:React.FC = () => {
    const params = useParams<{ id: string }>();
    const dispatch: AppDispatch = useDispatch();
    const gameresults=useSelector(selectGameResults);
    const [date,setDate]=useState("");
    const history = useHistory();
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGameResults(params.id));
            }
        };
        fetchLoader();
    },[]);

    const selectgameresults=gameresults.filter((result)=>{
        return result.created_at.includes(date)
    });

    let profile:{user_id:number,nickName:string,score:number,gamecount:number,rank1:number,rank2:number,rank3:number,rank4:number}[]=[];
    selectgameresults.map((selectresult)=>{
        selectresult.results.map((r)=>{
            if(profile.length!==0){
                let selectprof=profile.filter((pro)=>{
                return pro.user_id===r.profile.userProfile;
                })
                //プロフィールがない時
                if(selectprof.length===0){
                    if(r.rank===1){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:1,rank2:0,rank3:0,rank4:0});}
                    if(r.rank===2){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:1,rank3:0,rank4:0});}
                    if(r.rank===3){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:1,rank4:0});}
                    if(r.rank===4){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:0,rank4:1});}
                }else{
                //　情報更新
                    selectprof[0].gamecount+=1;
                    if(r.rank===1){selectprof[0].rank1+=1;}
                    if(r.rank===2){selectprof[0].rank2+=1;}
                    if(r.rank===3){selectprof[0].rank3+=1;}
                    if(r.rank===4){selectprof[0].rank4+=1;}
                    selectprof[0].score+=r.score;
                }
            }else{
                if(r.rank===1){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:1,rank2:0,rank3:0,rank4:0});}
                if(r.rank===2){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:1,rank3:0,rank4:0});}
                if(r.rank===3){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:1,rank4:0});}
                if(r.rank===4){profile.push({user_id:r.user_id,nickName:r.profile.nickName,score:r.score,gamecount:1,rank1:0,rank2:0,rank3:0,rank4:1});}
            }
        })
    })
    
      
    const useStyles = makeStyles({
    table: {
        minWidth: 700,
        maxWidth:1200,
    },
    });
    console.log(profile)
    const classes = useStyles();
    return (
        <div>
            <br/>
            <br/>
            <br/>
            <Button onClick={()=>history.push(`/group/${params.id}/`)}>戻る</Button>
            <br/>
            <TextField
                id="date"
                label="記録検索"
                type="month"
                onChange={(e)=>setDate(e.target.value)}
                defaultValue={date}
                fullWidth
                // className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <div >
                対局記録<br/>{date}
                <br/>
                <br/>
                <div>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableHead>
                            <TableRow>
                                <TableCell>成績集計結果</TableCell>
                                <TableCell>合計スコア</TableCell>
                                <TableCell>平均スコア</TableCell>
                                <TableCell>平均順位</TableCell>
                                <TableCell>1位回数</TableCell>
                                <TableCell>2位回数</TableCell>
                                <TableCell>3位回数</TableCell>
                                <TableCell>4位回数</TableCell>
                                <TableCell>対局数</TableCell>
                                <TableCell>トップ率</TableCell>
                                <TableCell>ラス率</TableCell>
                                <TableCell>連対率</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                                {profile.map((prof)=>(
                                    <TableRow key={prof.user_id}>
                                        <TableCell component="th" scope="row">{prof.nickName}</TableCell>
                                        <TableCell>{prof.score}</TableCell>
                                        <TableCell>{(prof.score/prof.gamecount).toFixed(1)}</TableCell>
                                        <TableCell>{((1*prof.rank1+2*prof.rank2+3*prof.rank3+4*prof.rank4)/prof.gamecount).toFixed(1)}</TableCell>
                                        <TableCell>{prof.rank1}</TableCell>
                                        <TableCell>{prof.rank2}</TableCell>
                                        <TableCell>{prof.rank3}</TableCell>
                                        <TableCell>{prof.rank4}</TableCell>
                                        <TableCell>{prof.gamecount}</TableCell>
                                        <TableCell>{(((prof.rank1)/prof.gamecount)*100).toFixed(1)}</TableCell>
                                        <TableCell>{(((prof.rank4)/prof.gamecount)*100).toFixed(1)}</TableCell>
                                        <TableCell>{(((prof.rank1+prof.rank2)/prof.gamecount)*100).toFixed(1)}</TableCell>
                                    </TableRow>
                                ))}
                                
                            </TableBody>
                            
                        </Table>
                    </TableContainer>
                </div>
                <br/>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>1位</TableCell>
                            <TableCell>2位</TableCell>
                            <TableCell>3位</TableCell>
                            <TableCell>4位</TableCell>
                        </TableRow>
                    </TableHead>
                    {gameresults.map((gameresult)=>(
                        <GameResults {...gameresult}/>
                    ))}
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default MatchRecord
