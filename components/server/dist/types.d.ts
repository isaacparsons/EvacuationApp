import { OrganizationMember, PrismaClient } from "@prisma/client";
export interface Context {
    db: PrismaClient;
    user: User;
}
export interface User {
    id: number;
    email: string;
    phoneNumber: string | null;
    passwordHash: string | null;
    accountCreated: boolean;
    firstName: string;
    lastName: string;
    organizations?: OrganizationMember[];
    groups?: GroupMember[];
}
export interface Group {
    id: number;
    name: string;
    organizationId: number;
}
export interface GroupMember {
    id: number;
    userId: number;
    groupId: number;
    status: string;
    admin: boolean;
    group: Group;
}
export interface GroupNotificationSetting {
    id: number;
    groupId: number;
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
}
export interface EvacuationEvent {
    id: number;
    startTime: string;
    endTime: string;
    createdBy: number;
    status: string;
    message: string;
    groupId: number;
}
export interface EvacuationResponse {
    id: number;
    response: string;
    userId: number;
    time: string;
    evacuationId: number;
}
export declare const SCOPE_GROUP_ADMIN = "GROUP_ADMIN";
export declare const SCOPE_GROUP_MEMBER = "GROUP_MEMBER";
export declare const SCOPE_ORG_ADMIN = "ORG_ADMIN";
export declare const SCOPE_ORG_MEMBER = "ORG_MEMBER";
export declare type SCOPES = typeof SCOPE_GROUP_ADMIN | typeof SCOPE_GROUP_MEMBER | typeof SCOPE_ORG_ADMIN | typeof SCOPE_ORG_MEMBER;
export declare type UserWithoutPassword = Omit<User, "passwordHash">;
export interface Auth {
    user: UserWithoutPassword;
    token: string;
}
export interface InviteUser {
    email: string;
    admin: boolean;
}
