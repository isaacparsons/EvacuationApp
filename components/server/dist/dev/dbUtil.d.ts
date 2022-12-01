import { InviteUser } from "../types";
interface InvitedOrganizationUser {
    admin: boolean;
    email: string;
    inviteToGroups: InviteUser[];
}
export declare const seedDb: () => Promise<void>;
export declare const deleteDb: () => Promise<void>;
export declare const setupUser: (email: string, phoneNumber: string) => Promise<{
    user: import(".prisma/client").User;
    token: string;
}>;
export declare const createOrg: (orgName: string, token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export declare const inviteUsersToOrg: (organizationId: number, users: InvitedOrganizationUser[], token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export declare const updateInvite: (organizationId: number, status: string, token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export declare const removeOrgMembers: (organizationId: string, memberIds: number[], token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export declare const deleteOrg: (organizationId: string, token: string) => Promise<import("apollo-server-plugin-base").GraphQLResponse>;
export {};
