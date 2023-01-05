interface InvitedOrganizationUser {
    admin: boolean;
    email: string;
}
export declare const deleteDb: () => Promise<void>;
export declare const setupUser: (data: {
    email: string;
    phoneNumber: string;
    password: string;
    accountCreated: boolean;
    firstName?: string;
    lastName?: string;
}) => Promise<{
    user: import(".prisma/client").User;
    token: string;
}>;
export declare const createOrg: (orgName: string, token: string) => Promise<void>;
export declare const inviteUsersToOrg: (organizationId: number, users: InvitedOrganizationUser[], token: string) => Promise<void>;
export declare const updateInvite: (organizationId: number, status: string, token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export declare const removeOrgMembers: (organizationId: string, memberIds: number[], token: string) => Promise<void>;
export declare const deleteOrg: (organizationId: string, token: string) => Promise<void>;
export declare const createGroup: (variables: any, token: string) => Promise<void>;
export {};
