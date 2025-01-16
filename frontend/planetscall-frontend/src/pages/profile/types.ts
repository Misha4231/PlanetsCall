export interface User{
    id:number;
    email:string;
    username:string;
    profile_image?: string | "https://www.pastelowelove.pl/userdata/public/gfx/5582/kotek-mruczek--naklejka.-naklejka-dla-dzieci.-dekoracje-pokoju.jpg";
    points?: number | null;
    description: string;
    theme_preference: number;
    created_at: string;
    last_login_at: string;
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