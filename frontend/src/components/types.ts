export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
}

export interface PROPS_AUTHEN {
    email: string;
    password: string;
}

export interface PROPS_BELONG_TO_GROUP{
    id: number;
    title:string;
    img:string;
    profile:{
        id: number;
        nickName: string;
        text:string;
        userProfile: number;
        created_on: string;
        img: string;
    }[]        
}

export interface PROPS_CREATE_GROUP{
    title:string;
    img:File|null;
}

export interface PROPS_GAME_RESULTS{
        id:number,
        group_id:number,
        created_at:string,
        results:
          {
            id:number,
            game_id:number,
            user_id:number,
            rank:number,
            score:number,
            profile:
              {
                id: number,
                nickName: string,
                text:string,
                userProfile: number,
                created_on: string,
                img: string,
              }
          }[],
}

export interface PROPS_CREATE_GAME{
    group_id:string
}

export interface PROFILE{
    id: number;
    nickName: string;
    text:string;
    userProfile: number;
    created_on: string;
    img: string;   
}[]

export interface PROPS_RATE{
    rate_id:number;
    group_id:number;
    user_id:number;
    rate:number;
}
export interface PROPS_CREATE_GAME_RESLTS{
    game_id:number;
    user_id:number;
    rank:number;
    score:number;
}