export interface UserAdmin {
    id: number;
    email: string;
    username: string;
    isActivated: boolean;
    isBlocked: boolean;
    isAdmin: boolean;
    firstName: string | null;
    lastName: string | null;
    points: number;
    preferredLanguage: string;
    profileImage: string | null;
    progress: number;
    status: string;
}


export interface UsersResponseAdmin {
    items: UserAdmin[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageIndex: number;
    totalPages: number;
  }