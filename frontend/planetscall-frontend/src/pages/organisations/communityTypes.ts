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


export interface Organisation {
    id: number;
    name: string;
    uniqueName: string;
    description: string;
    organizationLogo: string;
    isPrivate: boolean;
    isVerified: boolean;
    minimumJoinLevel: number;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    creator: {
        id: number;
        email: string;
        username: string;
        isActivated: boolean;
        isBlocked: boolean;
    };
    members?: Member[];
    roles: any[];
    instagramLink: string;
    linkedinLink: string;
    youtubeLink: string;
}

export interface OrganisationsResponse {
    items: Organisation[];
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Member {
    email: string;
    firstName: null | string; 
    id: number;
    isActivated: boolean;
    isAdmin: boolean;
    isBlocked: boolean;
    lastName: null | string; 
    points: number;
    preferredLanguage: string;
    profileImage: null | string;
    progress: number;
    status: string;
    username: string;
  }