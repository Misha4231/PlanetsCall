export interface Friend {
    id: number;
    email: string;
    username: string;
    isActivated: boolean;
    isBlocked: boolean;
    firstName: string | null;
    lastName: string | null;
    points: number;
    preferredLanguage: string;
    profileImage: string | null;
    progress: number;
    status: string;
  }