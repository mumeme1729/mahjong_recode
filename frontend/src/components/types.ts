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