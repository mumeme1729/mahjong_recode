import { Avatar, Button } from '@material-ui/core';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { AppDispatch } from '../../app/store';
import { fetchAsyncGetGameResults, fetchAsyncGetSelectProfile, selectGameResults, selectSelectProfile } from './groupSlice';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, Tooltip } from 'recharts';
import styles from "./Group.module.css";

const MemberDetail:React.FC = () => {
    const params = useParams<{ id: string,user_id:string }>();
    const dispatch: AppDispatch = useDispatch();
    const gameresults=useSelector(selectGameResults);
    const history = useHistory();
    const prof=useSelector(selectSelectProfile);
    useEffect(()=>{
        const fetchLoader = async ()=>{
            if (localStorage.localJWT) {
                await dispatch(fetchAsyncGetGameResults(params.id));
                await dispatch(fetchAsyncGetSelectProfile(params.user_id));
            }
        };
        fetchLoader();
    },[]);

    let rank1:number=0;
    let rank2:number=0;
    let rank3:number=0;
    let rank4:number=0;
    let score:number=0;
    let gamecount:number=0;
    let nickname:string="";
    let img:string="";
    let finduser=false;
    const res=gameresults.map((gameresult)=>{
       return gameresult.results.map((r)=>{
            if(String(r.user_id)===params.user_id){
                gamecount+=1;
                score+=r.score;
                if(r.rank===1){rank1+=1}
                if(r.rank===2){rank2+=1}
                if(r.rank===3){rank3+=1}
                if(r.rank===4){rank4+=1}
                nickname=r.profile.nickName;
                img=r.profile.img;
                finduser=true;
            }
        })
    });
    const useStyles = makeStyles({
        table: {
            minWidth: 700,
            maxWidth:1200,
        },
        });
    
    const classes = useStyles();
    const url='http://127.0.0.1:8000'
    //平均ランク
    let average_rank=0;
    let top_rate=0;
    let las_rate=0;
    let rentai_rate=0;
    let average_score=0;
    if(finduser){
        let rank=(1*rank1+2*rank2+3*rank3+4*rank4)/gamecount;
        if((rank)<=2.3){
            average_rank=100;
        }else if((rank)>2.3 && (rank)<2.5){
            average_rank=75;
        }else if((rank)>=2.5 && (rank)<2.7){
            average_rank=50;
        }else{
            average_rank=25;
        }
        //トップ率
        let top=((rank1)/gamecount)*100;
        
        if(top>=30){
            top_rate=100;
        }else if(top<30 && top>25){
            top_rate=75;
        }else if(top<=25 && top >20){
            top_rate=50;
        }else{
            top_rate=25;
        }
        //ラス回避率
        let las=100-(((rank4)/gamecount)*100);
        if(las>=80){
            las_rate=100;
        }else if(las<80 && las>75){
            las_rate=75;
        }else if(las<=75 && las >70){
            las_rate=50;
        }else{
            las_rate=25;
        }
        //連対
        let rentai=((rank1+rank2)/gamecount)*100;
        if(rentai>=60){
            rentai_rate=100;
        }else if(rentai<60 && rentai >55){
            rentai_rate=75;
        }else if(rentai <=55 && rentai>=50){
            rentai_rate=50;
        }else{
            rentai_rate=25;
        }
        //スコア
        let setscore=score/gamecount;
        if(setscore>=20){
            average_score=100;
        }else if(setscore<20 && setscore>=10){
            average_score=75;
        }else if(setscore<10 && setscore>=0){
            average_score=50;
        }else{
            average_score=25;
        }
    }else{
        nickname=prof.nickName;
        img=prof.img;
    }
    const data = [
        { rank: '平均スコア', value: average_score},
        { rank: '平均順位', value: average_rank },
        { rank: 'トップ率', value: top_rate },
        { rank: 'ラス回避率', value: las_rate },
        { rank: '連対率', value:rentai_rate },
        ];
    return (
        <div>
            <br/>
            <Button variant="outlined" color="primary" onClick={()=>history.push(`/group/${params.id}/member/`)}>戻る</Button>
            <div className={styles.memberdetail_container_top}>
                <div className={styles.memberdetail_prof}>
                    {img!==""?
                        <div className={styles.memberdetail_prof_avatar}>
                            {img[0]!=="h"?
                                <Avatar alt="who?" src={url+img} style={{height:'70px',width:'70px'}}/>
                            :   <Avatar alt="who?" src={img} style={{height:'70px',width:'70px'}}/>}
                        </div>
                    :null}
                    {nickname}
                </div>
                <div className={styles.memberdetail_chart}>
                    <RadarChart // レーダーチャートのサイズや位置、データを指定
                        height={250} //レーダーチャートの全体の高さを指定
                        width={350} //レーダーチャートの全体の幅を指定
                        cx="50%" //要素の左を基準に全体の50%移動
                        cy="50%" //要素の上を基準に全体の50%移動
                        outerRadius={100}
                        data={data} //ここにArray型のデータを指定
                        >
                        <PolarGrid /> // レーダーのグリッド線を表示
                        <PolarAngleAxis
                            dataKey="rank" //Array型のデータの、数値を表示したい値のキーを指定
                            domain={[100]}
                        />
                        <PolarRadiusAxis 
                            tick={false}
                            axisLine={false}
                            domain={[0,100]}
                        />
                        <Radar //レーダーの色や各パラメーターのタイトルを指定
                            name="Mike"  //hoverした時に表示される名前を指定 
                            dataKey="value" //Array型のデータのパラメータータイトルを指定
                            stroke="#8884d8"  //レーダーの線の色を指定
                            fill="#8884d8" //レーダーの中身の色を指定
                            fillOpacity={0.6} //レーダーの中身の色の薄さを指定
                        />
                        {/* <Tooltip /> //hoverすると各パラメーターの値が表示される */}
                    </RadarChart>
                </div>
            </div>
            {finduser?
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                        <TableRow>
                            <TableCell>合計スコア</TableCell>
                            <TableCell>平均スコア</TableCell>
                            <TableCell>平均順位</TableCell>
                            <TableCell>1位回数</TableCell>
                            <TableCell>2位回数</TableCell>
                            <TableCell>3位回数</TableCell>
                            <TableCell>4位回数</TableCell>
                            <TableCell>対局数</TableCell>
                            <TableCell>トップ率</TableCell>
                            <TableCell>ラス回避率</TableCell>
                            <TableCell>連対率</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row" align="center">{score}</TableCell>
                                <TableCell align="center">{(score/gamecount).toFixed(1)}</TableCell>
                                <TableCell align="center">{((1*rank1+2*rank2+3*rank3+4*rank4)/gamecount).toFixed(1)}</TableCell>
                                <TableCell align="center">{rank1}</TableCell>
                                <TableCell align="center">{rank2}</TableCell>
                                <TableCell align="center">{rank3}</TableCell>
                                <TableCell align="center">{rank4}</TableCell>
                                <TableCell align="center">{gamecount}</TableCell>
                                <TableCell align="center">{(((rank1)/gamecount)*100).toFixed(1)}</TableCell>
                                <TableCell align="center">{(((rank4)/gamecount)*100).toFixed(1)}</TableCell>
                                <TableCell align="center">{(((rank1+rank2)/gamecount)*100).toFixed(1)}</TableCell>
                            </TableRow>   
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            :<div>対局記録がありません</div>}
        </div>
    )
}

export default MemberDetail
