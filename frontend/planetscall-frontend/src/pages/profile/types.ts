export interface User{
    id:number;
    email:string;
    username:string;
    profile_image:string;
    ponits: number;
    description: string;
    theme_preference: number;
    created_at: string;
    last_login_at: string;
}

export interface Achievement {
    title : string;
    description : string;
    created_at:string;
}