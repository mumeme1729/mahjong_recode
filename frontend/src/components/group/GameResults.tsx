import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { PROPS_GAME_RESULTS } from '../types'
import styles from "./Group.module.css";
import { selecGroup, selectGameResults } from './groupSlice';

const GameResults:React.FC<PROPS_GAME_RESULTS> = (gameresults) => {
    const dispatch: AppDispatch = useDispatch();
    const group=useSelector(selecGroup);
    const groupmember=group.profile;
    let results=gameresults.results;
    const allgameresults=useSelector(selectGameResults);

    const deletegame=(id:number)=>{
        
    }
    
    return (
        <div className={styles.gameresult_container}>
            {results.map((result=>(
                
                <div key={result.id} className={styles.gameresult_body}>
                    {result.rank}位
                    {result.score}
                    {result.profile.nickName}
                    <br/>
                </div>
                
            )))}

            <button　onClick={()=>{deletegame(results[0].game_id)}}>
                    けす
            </button>
        </div>
    )
}

export default GameResults
