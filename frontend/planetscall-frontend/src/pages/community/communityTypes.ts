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
    minimumJoinLevel: number;
}

export interface OrganisationsResponse {
    items: Organisation[];
    pageIndex: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}