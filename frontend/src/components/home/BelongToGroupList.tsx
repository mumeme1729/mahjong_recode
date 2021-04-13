import { Avatar } from '@material-ui/core';
import React from 'react';
import {PROPS_BELONG_TO_GROUP} from '../types';


const BelongToGroupList:React.FC<PROPS_BELONG_TO_GROUP> = (group) => {
    return (
        <div>
            <div>
                <Avatar alt="who?" src={group.img} style={{height:'70px',width:'70px'}}/>
            </div>
            {group.title}
            <div>
            </div>
        </div>
    )
}

export default BelongToGroupList
