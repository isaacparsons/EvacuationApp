import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../../src/context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};
export type AddGroupUser = {
    admin: Scalars['Boolean'];
    userId: Scalars['Int'];
};
export type Announcement = {
    __typename?: 'Announcement';
    createdBy: Scalars['Int'];
    date: Scalars['String'];
    description?: Maybe<Scalars['String']>;
    id: Scalars['Int'];
    organization?: Maybe<Organization>;
    organizationId: Scalars['Int'];
    title: Scalars['String'];
};
export type Auth = {
    __typename?: 'Auth';
    token: Scalars['String'];
    user: User;
};
export type EvacuationEvent = {
    __typename?: 'EvacuationEvent';
    createdBy: Scalars['Int'];
    endTime?: Maybe<Scalars['String']>;
    groupId: Scalars['Int'];
    id: Scalars['Int'];
    message?: Maybe<Scalars['String']>;
    responses?: Maybe<Array<EvacuationResponse>>;
    startTime: Scalars['String'];
    status: Scalars['String'];
};
export type EvacuationResponse = {
    __typename?: 'EvacuationResponse';
    evacuationId: Scalars['Int'];
    id: Scalars['Int'];
    response: Scalars['String'];
    time: Scalars['String'];
    user?: Maybe<User>;
    userId: Scalars['Int'];
};
export type GetAnnouncements = {
    __typename?: 'GetAnnouncements';
    cursor?: Maybe<Scalars['Int']>;
    data: Array<Announcement>;
};
export type GetEvacuationEvents = {
    __typename?: 'GetEvacuationEvents';
    cursor?: Maybe<Scalars['Int']>;
    data: Array<EvacuationEvent>;
};
export type GetGroupMembers = {
    __typename?: 'GetGroupMembers';
    cursor?: Maybe<Scalars['Int']>;
    data: Array<GroupMember>;
};
export type GetOrganizationMembers = {
    __typename?: 'GetOrganizationMembers';
    cursor?: Maybe<Scalars['Int']>;
    data: Array<OrganizationMember>;
};
export type Group = {
    __typename?: 'Group';
    evacuationEvents?: Maybe<Array<EvacuationEvent>>;
    id: Scalars['Int'];
    members?: Maybe<Array<GroupMember>>;
    name: Scalars['String'];
    notificationSetting?: Maybe<GroupNotificationSetting>;
    organizationId: Scalars['Int'];
};
export type GroupMember = {
    __typename?: 'GroupMember';
    admin: Scalars['Boolean'];
    group?: Maybe<Group>;
    groupId: Scalars['Int'];
    id: Scalars['Int'];
    organizationMember?: Maybe<OrganizationMember>;
    organizationMemberId: Scalars['Int'];
    user?: Maybe<User>;
    userId: Scalars['Int'];
};
export type GroupNotificationSetting = {
    __typename?: 'GroupNotificationSetting';
    emailEnabled: Scalars['Boolean'];
    groupId: Scalars['Int'];
    id: Scalars['Int'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export type GroupNotificationSettingInput = {
    emailEnabled: Scalars['Boolean'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export type InvitedOrganizationUser = {
    admin: Scalars['Boolean'];
    email: Scalars['String'];
};
export declare enum MemberInviteStatus {
    Accepted = "ACCEPTED",
    Declined = "DECLINED",
    Pending = "PENDING"
}
export type Mutation = {
    __typename?: 'Mutation';
    addUsersToGroup: Array<GroupMember>;
    createEvacuationEvent: EvacuationEvent;
    createEvacuationEventResponse: EvacuationResponse;
    createGroup: Group;
    createOrganization: Organization;
    createOrganizationAnnouncement: Announcement;
    deleteGroup: Group;
    deleteOrganization: Organization;
    deleteOrganizationAnnouncement: Announcement;
    deleteUser: User;
    inviteToOrganization?: Maybe<Array<OrganizationMember>>;
    login: Auth;
    removeFromOrganization?: Maybe<Array<OrganizationMember>>;
    removeMembers: Array<GroupMember>;
    resetPassword: User;
    signup: Auth;
    updateEvacuationEvent: EvacuationEvent;
    updateGroupMember: GroupMember;
    updateGroupNotificationOptions: GroupNotificationSetting;
    updateOrgInvite: OrganizationMember;
    updateOrganizationNotificationOptions: OrganizationNotificationSetting;
    updateUser: User;
};
export type MutationAddUsersToGroupArgs = {
    groupId: Scalars['Int'];
    users: Array<AddGroupUser>;
};
export type MutationCreateEvacuationEventArgs = {
    groupId: Scalars['Int'];
    msg: Scalars['String'];
};
export type MutationCreateEvacuationEventResponseArgs = {
    evacuationId: Scalars['Int'];
    response: Scalars['String'];
};
export type MutationCreateGroupArgs = {
    groupNotificationSetting: GroupNotificationSettingInput;
    name: Scalars['String'];
    organizationId: Scalars['Int'];
};
export type MutationCreateOrganizationArgs = {
    name: Scalars['String'];
    organizationNotificationSetting: OrganizationNotificationSettingInput;
};
export type MutationCreateOrganizationAnnouncementArgs = {
    description?: InputMaybe<Scalars['String']>;
    groupIds?: InputMaybe<Array<Scalars['Int']>>;
    organizationId: Scalars['Int'];
    title: Scalars['String'];
};
export type MutationDeleteGroupArgs = {
    groupId: Scalars['Int'];
};
export type MutationDeleteOrganizationArgs = {
    organizationId: Scalars['Int'];
};
export type MutationDeleteOrganizationAnnouncementArgs = {
    announcementId: Scalars['Int'];
};
export type MutationInviteToOrganizationArgs = {
    groupIds?: InputMaybe<Array<Scalars['Int']>>;
    organizationId: Scalars['Int'];
    users: Array<InvitedOrganizationUser>;
};
export type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};
export type MutationRemoveFromOrganizationArgs = {
    organizationId: Scalars['Int'];
    userIds: Array<Scalars['Int']>;
};
export type MutationRemoveMembersArgs = {
    groupId: Scalars['Int'];
    userIds: Array<Scalars['Int']>;
};
export type MutationResetPasswordArgs = {
    email: Scalars['String'];
};
export type MutationSignupArgs = {
    email: Scalars['String'];
    firstName: Scalars['String'];
    lastName: Scalars['String'];
    password: Scalars['String'];
    phoneNumber: Scalars['String'];
};
export type MutationUpdateEvacuationEventArgs = {
    evacuationId: Scalars['Int'];
    status: Scalars['String'];
};
export type MutationUpdateGroupMemberArgs = {
    admin: Scalars['Boolean'];
    groupId: Scalars['Int'];
    userId: Scalars['Int'];
};
export type MutationUpdateGroupNotificationOptionsArgs = {
    groupId: Scalars['Int'];
    groupNotificationSetting: GroupNotificationSettingInput;
};
export type MutationUpdateOrgInviteArgs = {
    organizationId: Scalars['Int'];
    status: Scalars['String'];
};
export type MutationUpdateOrganizationNotificationOptionsArgs = {
    organizationId: Scalars['Int'];
    organizationNotificationSetting: OrganizationNotificationSettingInput;
};
export type MutationUpdateUserArgs = {
    firstName?: InputMaybe<Scalars['String']>;
    lastName?: InputMaybe<Scalars['String']>;
    password?: InputMaybe<Scalars['String']>;
    phoneNumber?: InputMaybe<Scalars['String']>;
};
export type Organization = {
    __typename?: 'Organization';
    announcements?: Maybe<Array<Announcement>>;
    groups?: Maybe<Array<Group>>;
    id: Scalars['Int'];
    members?: Maybe<Array<OrganizationMember>>;
    name: Scalars['String'];
    notificationSetting?: Maybe<OrganizationNotificationSetting>;
};
export type OrganizationMember = {
    __typename?: 'OrganizationMember';
    admin: Scalars['Boolean'];
    id: Scalars['Int'];
    organization?: Maybe<Organization>;
    organizationId: Scalars['Int'];
    status: Scalars['String'];
    user?: Maybe<User>;
    userId: Scalars['Int'];
};
export type OrganizationNotificationSetting = {
    __typename?: 'OrganizationNotificationSetting';
    emailEnabled: Scalars['Boolean'];
    id: Scalars['Int'];
    organizationId: Scalars['Int'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export type OrganizationNotificationSettingInput = {
    emailEnabled: Scalars['Boolean'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export type Query = {
    __typename?: 'Query';
    getAnnouncements: GetAnnouncements;
    getEvacuationEvent: EvacuationEvent;
    getEvacuationEvents: GetEvacuationEvents;
    getGroup: Group;
    getGroupForUser: UserGroup;
    getGroupMembers: GetGroupMembers;
    getInProgressEvacuationEvents: Array<EvacuationEvent>;
    getJoinedEntities?: Maybe<User>;
    getOrganization: Organization;
    getOrganizationForUser: UserOrganization;
    getOrganizationMembers: GetOrganizationMembers;
    getOrganizations: Array<OrganizationMember>;
};
export type QueryGetAnnouncementsArgs = {
    cursor?: InputMaybe<Scalars['Int']>;
    organizationId: Scalars['Int'];
};
export type QueryGetEvacuationEventArgs = {
    evacuationId: Scalars['Int'];
};
export type QueryGetEvacuationEventsArgs = {
    cursor?: InputMaybe<Scalars['Int']>;
    groupId: Scalars['Int'];
};
export type QueryGetGroupArgs = {
    groupId: Scalars['Int'];
};
export type QueryGetGroupForUserArgs = {
    groupId: Scalars['Int'];
};
export type QueryGetGroupMembersArgs = {
    cursor?: InputMaybe<Scalars['Int']>;
    groupId: Scalars['Int'];
};
export type QueryGetOrganizationArgs = {
    organizationId: Scalars['Int'];
};
export type QueryGetOrganizationForUserArgs = {
    organizationId: Scalars['Int'];
};
export type QueryGetOrganizationMembersArgs = {
    cursor?: InputMaybe<Scalars['Int']>;
    organizationId: Scalars['Int'];
};
export declare enum Scopes {
    GroupAdmin = "GROUP_ADMIN",
    OrgAdmin = "ORG_ADMIN"
}
export type User = {
    __typename?: 'User';
    accountCreated: Scalars['Boolean'];
    email: Scalars['String'];
    evacuationResponses?: Maybe<Array<EvacuationResponse>>;
    firstName?: Maybe<Scalars['String']>;
    groups?: Maybe<Array<GroupMember>>;
    id: Scalars['Int'];
    lastName?: Maybe<Scalars['String']>;
    organizations?: Maybe<Array<OrganizationMember>>;
    passwordHash?: Maybe<Scalars['String']>;
    phoneNumber?: Maybe<Scalars['String']>;
};
export type UserGroup = {
    __typename?: 'UserGroup';
    evacuationEvents?: Maybe<Array<EvacuationEvent>>;
    id: Scalars['Int'];
    members?: Maybe<Array<GroupMember>>;
    name: Scalars['String'];
    organizationId: Scalars['Int'];
};
export type UserOrganization = {
    __typename?: 'UserOrganization';
    announcements?: Maybe<Array<Announcement>>;
    groups?: Maybe<Array<GroupMember>>;
    id: Scalars['Int'];
    members?: Maybe<Array<OrganizationMember>>;
    name: Scalars['String'];
    notificationSetting?: Maybe<OrganizationNotificationSetting>;
};
export type ResolverTypeWrapper<T> = Promise<T> | T;
export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;
export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export type NextResolverFn<T> = () => Promise<T>;
export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    AddGroupUser: AddGroupUser;
    Announcement: ResolverTypeWrapper<Announcement>;
    Auth: ResolverTypeWrapper<Auth>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    EvacuationEvent: ResolverTypeWrapper<EvacuationEvent>;
    EvacuationResponse: ResolverTypeWrapper<EvacuationResponse>;
    GetAnnouncements: ResolverTypeWrapper<GetAnnouncements>;
    GetEvacuationEvents: ResolverTypeWrapper<GetEvacuationEvents>;
    GetGroupMembers: ResolverTypeWrapper<GetGroupMembers>;
    GetOrganizationMembers: ResolverTypeWrapper<GetOrganizationMembers>;
    Group: ResolverTypeWrapper<Group>;
    GroupMember: ResolverTypeWrapper<GroupMember>;
    GroupNotificationSetting: ResolverTypeWrapper<GroupNotificationSetting>;
    GroupNotificationSettingInput: GroupNotificationSettingInput;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    InvitedOrganizationUser: InvitedOrganizationUser;
    MemberInviteStatus: MemberInviteStatus;
    Mutation: ResolverTypeWrapper<{}>;
    Organization: ResolverTypeWrapper<Organization>;
    OrganizationMember: ResolverTypeWrapper<OrganizationMember>;
    OrganizationNotificationSetting: ResolverTypeWrapper<OrganizationNotificationSetting>;
    OrganizationNotificationSettingInput: OrganizationNotificationSettingInput;
    Query: ResolverTypeWrapper<{}>;
    Scopes: Scopes;
    String: ResolverTypeWrapper<Scalars['String']>;
    User: ResolverTypeWrapper<User>;
    UserGroup: ResolverTypeWrapper<UserGroup>;
    UserOrganization: ResolverTypeWrapper<UserOrganization>;
};
/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    AddGroupUser: AddGroupUser;
    Announcement: Announcement;
    Auth: Auth;
    Boolean: Scalars['Boolean'];
    EvacuationEvent: EvacuationEvent;
    EvacuationResponse: EvacuationResponse;
    GetAnnouncements: GetAnnouncements;
    GetEvacuationEvents: GetEvacuationEvents;
    GetGroupMembers: GetGroupMembers;
    GetOrganizationMembers: GetOrganizationMembers;
    Group: Group;
    GroupMember: GroupMember;
    GroupNotificationSetting: GroupNotificationSetting;
    GroupNotificationSettingInput: GroupNotificationSettingInput;
    Int: Scalars['Int'];
    InvitedOrganizationUser: InvitedOrganizationUser;
    Mutation: {};
    Organization: Organization;
    OrganizationMember: OrganizationMember;
    OrganizationNotificationSetting: OrganizationNotificationSetting;
    OrganizationNotificationSettingInput: OrganizationNotificationSettingInput;
    Query: {};
    String: Scalars['String'];
    User: User;
    UserGroup: UserGroup;
    UserOrganization: UserOrganization;
};
export type AnnouncementResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Announcement'] = ResolversParentTypes['Announcement']> = {
    createdBy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    date?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type AuthResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']> = {
    token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type EvacuationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvacuationEvent'] = ResolversParentTypes['EvacuationEvent']> = {
    createdBy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    endTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    responses?: Resolver<Maybe<Array<ResolversTypes['EvacuationResponse']>>, ParentType, ContextType>;
    startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type EvacuationResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvacuationResponse'] = ResolversParentTypes['EvacuationResponse']> = {
    evacuationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    response?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GetAnnouncementsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetAnnouncements'] = ResolversParentTypes['GetAnnouncements']> = {
    cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    data?: Resolver<Array<ResolversTypes['Announcement']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GetEvacuationEventsResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetEvacuationEvents'] = ResolversParentTypes['GetEvacuationEvents']> = {
    cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    data?: Resolver<Array<ResolversTypes['EvacuationEvent']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GetGroupMembersResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetGroupMembers'] = ResolversParentTypes['GetGroupMembers']> = {
    cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    data?: Resolver<Array<ResolversTypes['GroupMember']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GetOrganizationMembersResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetOrganizationMembers'] = ResolversParentTypes['GetOrganizationMembers']> = {
    cursor?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
    data?: Resolver<Array<ResolversTypes['OrganizationMember']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
    evacuationEvents?: Resolver<Maybe<Array<ResolversTypes['EvacuationEvent']>>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    members?: Resolver<Maybe<Array<ResolversTypes['GroupMember']>>, ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    notificationSetting?: Resolver<Maybe<ResolversTypes['GroupNotificationSetting']>, ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GroupMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupMember'] = ResolversParentTypes['GroupMember']> = {
    admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    organizationMember?: Resolver<Maybe<ResolversTypes['OrganizationMember']>, ParentType, ContextType>;
    organizationMemberId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type GroupNotificationSettingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupNotificationSetting'] = ResolversParentTypes['GroupNotificationSetting']> = {
    emailEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    pushEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    smsEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    addUsersToGroup?: Resolver<Array<ResolversTypes['GroupMember']>, ParentType, ContextType, RequireFields<MutationAddUsersToGroupArgs, 'groupId' | 'users'>>;
    createEvacuationEvent?: Resolver<ResolversTypes['EvacuationEvent'], ParentType, ContextType, RequireFields<MutationCreateEvacuationEventArgs, 'groupId' | 'msg'>>;
    createEvacuationEventResponse?: Resolver<ResolversTypes['EvacuationResponse'], ParentType, ContextType, RequireFields<MutationCreateEvacuationEventResponseArgs, 'evacuationId' | 'response'>>;
    createGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'groupNotificationSetting' | 'name' | 'organizationId'>>;
    createOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'name' | 'organizationNotificationSetting'>>;
    createOrganizationAnnouncement?: Resolver<ResolversTypes['Announcement'], ParentType, ContextType, RequireFields<MutationCreateOrganizationAnnouncementArgs, 'organizationId' | 'title'>>;
    deleteGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<MutationDeleteGroupArgs, 'groupId'>>;
    deleteOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'organizationId'>>;
    deleteOrganizationAnnouncement?: Resolver<ResolversTypes['Announcement'], ParentType, ContextType, RequireFields<MutationDeleteOrganizationAnnouncementArgs, 'announcementId'>>;
    deleteUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    inviteToOrganization?: Resolver<Maybe<Array<ResolversTypes['OrganizationMember']>>, ParentType, ContextType, RequireFields<MutationInviteToOrganizationArgs, 'organizationId' | 'users'>>;
    login?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
    removeFromOrganization?: Resolver<Maybe<Array<ResolversTypes['OrganizationMember']>>, ParentType, ContextType, RequireFields<MutationRemoveFromOrganizationArgs, 'organizationId' | 'userIds'>>;
    removeMembers?: Resolver<Array<ResolversTypes['GroupMember']>, ParentType, ContextType, RequireFields<MutationRemoveMembersArgs, 'groupId' | 'userIds'>>;
    resetPassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email'>>;
    signup?: Resolver<ResolversTypes['Auth'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'firstName' | 'lastName' | 'password' | 'phoneNumber'>>;
    updateEvacuationEvent?: Resolver<ResolversTypes['EvacuationEvent'], ParentType, ContextType, RequireFields<MutationUpdateEvacuationEventArgs, 'evacuationId' | 'status'>>;
    updateGroupMember?: Resolver<ResolversTypes['GroupMember'], ParentType, ContextType, RequireFields<MutationUpdateGroupMemberArgs, 'admin' | 'groupId' | 'userId'>>;
    updateGroupNotificationOptions?: Resolver<ResolversTypes['GroupNotificationSetting'], ParentType, ContextType, RequireFields<MutationUpdateGroupNotificationOptionsArgs, 'groupId' | 'groupNotificationSetting'>>;
    updateOrgInvite?: Resolver<ResolversTypes['OrganizationMember'], ParentType, ContextType, RequireFields<MutationUpdateOrgInviteArgs, 'organizationId' | 'status'>>;
    updateOrganizationNotificationOptions?: Resolver<ResolversTypes['OrganizationNotificationSetting'], ParentType, ContextType, RequireFields<MutationUpdateOrganizationNotificationOptionsArgs, 'organizationId' | 'organizationNotificationSetting'>>;
    updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<MutationUpdateUserArgs>>;
};
export type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
    announcements?: Resolver<Maybe<Array<ResolversTypes['Announcement']>>, ParentType, ContextType>;
    groups?: Resolver<Maybe<Array<ResolversTypes['Group']>>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    members?: Resolver<Maybe<Array<ResolversTypes['OrganizationMember']>>, ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    notificationSetting?: Resolver<Maybe<ResolversTypes['OrganizationNotificationSetting']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type OrganizationMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationMember'] = ResolversParentTypes['OrganizationMember']> = {
    admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type OrganizationNotificationSettingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationNotificationSetting'] = ResolversParentTypes['OrganizationNotificationSetting']> = {
    emailEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    pushEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    smsEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    getAnnouncements?: Resolver<ResolversTypes['GetAnnouncements'], ParentType, ContextType, RequireFields<QueryGetAnnouncementsArgs, 'organizationId'>>;
    getEvacuationEvent?: Resolver<ResolversTypes['EvacuationEvent'], ParentType, ContextType, RequireFields<QueryGetEvacuationEventArgs, 'evacuationId'>>;
    getEvacuationEvents?: Resolver<ResolversTypes['GetEvacuationEvents'], ParentType, ContextType, RequireFields<QueryGetEvacuationEventsArgs, 'groupId'>>;
    getGroup?: Resolver<ResolversTypes['Group'], ParentType, ContextType, RequireFields<QueryGetGroupArgs, 'groupId'>>;
    getGroupForUser?: Resolver<ResolversTypes['UserGroup'], ParentType, ContextType, RequireFields<QueryGetGroupForUserArgs, 'groupId'>>;
    getGroupMembers?: Resolver<ResolversTypes['GetGroupMembers'], ParentType, ContextType, RequireFields<QueryGetGroupMembersArgs, 'groupId'>>;
    getInProgressEvacuationEvents?: Resolver<Array<ResolversTypes['EvacuationEvent']>, ParentType, ContextType>;
    getJoinedEntities?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    getOrganization?: Resolver<ResolversTypes['Organization'], ParentType, ContextType, RequireFields<QueryGetOrganizationArgs, 'organizationId'>>;
    getOrganizationForUser?: Resolver<ResolversTypes['UserOrganization'], ParentType, ContextType, RequireFields<QueryGetOrganizationForUserArgs, 'organizationId'>>;
    getOrganizationMembers?: Resolver<ResolversTypes['GetOrganizationMembers'], ParentType, ContextType, RequireFields<QueryGetOrganizationMembersArgs, 'organizationId'>>;
    getOrganizations?: Resolver<Array<ResolversTypes['OrganizationMember']>, ParentType, ContextType>;
};
export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
    accountCreated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    evacuationResponses?: Resolver<Maybe<Array<ResolversTypes['EvacuationResponse']>>, ParentType, ContextType>;
    firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    groups?: Resolver<Maybe<Array<ResolversTypes['GroupMember']>>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    organizations?: Resolver<Maybe<Array<ResolversTypes['OrganizationMember']>>, ParentType, ContextType>;
    passwordHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserGroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserGroup'] = ResolversParentTypes['UserGroup']> = {
    evacuationEvents?: Resolver<Maybe<Array<ResolversTypes['EvacuationEvent']>>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    members?: Resolver<Maybe<Array<ResolversTypes['GroupMember']>>, ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type UserOrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserOrganization'] = ResolversParentTypes['UserOrganization']> = {
    announcements?: Resolver<Maybe<Array<ResolversTypes['Announcement']>>, ParentType, ContextType>;
    groups?: Resolver<Maybe<Array<ResolversTypes['GroupMember']>>, ParentType, ContextType>;
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    members?: Resolver<Maybe<Array<ResolversTypes['OrganizationMember']>>, ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    notificationSetting?: Resolver<Maybe<ResolversTypes['OrganizationNotificationSetting']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export type Resolvers<ContextType = Context> = {
    Announcement?: AnnouncementResolvers<ContextType>;
    Auth?: AuthResolvers<ContextType>;
    EvacuationEvent?: EvacuationEventResolvers<ContextType>;
    EvacuationResponse?: EvacuationResponseResolvers<ContextType>;
    GetAnnouncements?: GetAnnouncementsResolvers<ContextType>;
    GetEvacuationEvents?: GetEvacuationEventsResolvers<ContextType>;
    GetGroupMembers?: GetGroupMembersResolvers<ContextType>;
    GetOrganizationMembers?: GetOrganizationMembersResolvers<ContextType>;
    Group?: GroupResolvers<ContextType>;
    GroupMember?: GroupMemberResolvers<ContextType>;
    GroupNotificationSetting?: GroupNotificationSettingResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    Organization?: OrganizationResolvers<ContextType>;
    OrganizationMember?: OrganizationMemberResolvers<ContextType>;
    OrganizationNotificationSetting?: OrganizationNotificationSettingResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    User?: UserResolvers<ContextType>;
    UserGroup?: UserGroupResolvers<ContextType>;
    UserOrganization?: UserOrganizationResolvers<ContextType>;
};
