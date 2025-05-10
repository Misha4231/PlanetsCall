export interface User{
    id:number;
    email:string;
    username:string;
    profile_image:string;
    points: number;
    description: string;
    theme_preference: number;
    created_at: string;
    last_login_at: string;
}

export interface AnotherUser{
    id:number;
    email:string;
    username:string;
    firstName:string;
    lastName:string;
    isActivated: boolean;
    isAdmin: boolean;
    isBlocked:boolean;
    progress:number;
    status:string;
    profile_image:string;
    points: number;
}

export interface UserToken{
    userName: string;
    email: string;
    token: string;
  };
  

export interface Achievement {
    title : string;
    description : string;
    created_at:string;
}