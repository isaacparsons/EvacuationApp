import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../index';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export declare type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};
export declare type Auth = {
    __typename?: 'Auth';
    token: Scalars['String'];
    user: User;
};
export declare type EvacuationEvent = {
    __typename?: 'EvacuationEvent';
    id: Scalars['Int'];
    startTime: Scalars['String'];
    endTime?: Maybe<Scalars['String']>;
    createdBy: Scalars['Int'];
    status: Scalars['String'];
    groupId: Scalars['Int'];
    message?: Maybe<Scalars['String']>;
    responses?: Maybe<Array<Maybe<EvacuationResponse>>>;
};
export declare type EvacuationResponse = {
    __typename?: 'EvacuationResponse';
    id: Scalars['Int'];
    response: Scalars['String'];
    userId: Scalars['Int'];
    time: Scalars['String'];
    evacuationId: Scalars['Int'];
    user?: Maybe<User>;
};
export declare type Group = {
    __typename?: 'Group';
    id: Scalars['Int'];
    name: Scalars['String'];
    notificationSetting?: Maybe<GroupNotificationSetting>;
    members?: Maybe<Array<Maybe<GroupMember>>>;
    evacuationEvents?: Maybe<Array<Maybe<EvacuationEvent>>>;
};
export declare type GroupMember = {
    __typename?: 'GroupMember';
    id: Scalars['Int'];
    userId: Scalars['Int'];
    groupId: Scalars['Int'];
    status: Scalars['String'];
    admin: Scalars['Boolean'];
    group?: Maybe<Group>;
    user?: Maybe<User>;
};
export declare type GroupNotificationSetting = {
    __typename?: 'GroupNotificationSetting';
    id: Scalars['Int'];
    groupId: Scalars['Int'];
    emailEnabled: Scalars['Boolean'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export declare type GroupNotificationSettingInput = {
    emailEnabled: Scalars['Boolean'];
    pushEnabled: Scalars['Boolean'];
    smsEnabled: Scalars['Boolean'];
};
export declare type InvitedGroupUser = {
    admin: Scalars['Boolean'];
    email: Scalars['String'];
};
export declare type InvitedOrganizationUser = {
    admin: Scalars['Boolean'];
    email: Scalars['String'];
    inviteToGroups?: Maybe<Array<Maybe<InvitedGroupUser>>>;
};
export declare enum MemberInviteStatus {
    Accepted = "ACCEPTED",
    Pending = "PENDING",
    Declined = "DECLINED"
}
export declare type Mutation = {
    __typename?: 'Mutation';
    resetPassword?: Maybe<User>;
    login?: Maybe<Auth>;
    signup?: Maybe<Auth>;
    deleteUser?: Maybe<User>;
    updateUser?: Maybe<User>;
    createGroup?: Maybe<Group>;
    deleteGroup?: Maybe<Group>;
    updateGroupNotificationOptions?: Maybe<GroupNotificationSetting>;
    inviteUsers?: Maybe<Array<Maybe<GroupMember>>>;
    updateInvite?: Maybe<GroupMember>;
    removeMembers?: Maybe<Array<Maybe<GroupMember>>>;
    createEvacuationEvent?: Maybe<EvacuationEvent>;
    updateEvacuationEvent?: Maybe<EvacuationEvent>;
    createEvacuationEventResponse?: Maybe<EvacuationResponse>;
    createOrganization?: Maybe<Organization>;
    deleteOrganization?: Maybe<Organization>;
    inviteToOrganization?: Maybe<Array<Maybe<OrganizationMember>>>;
    updateOrgInvite?: Maybe<OrganizationMember>;
    removeFromOrganization?: Maybe<Array<Maybe<OrganizationMember>>>;
    sendOrganizationNotification?: Maybe<Scalars['String']>;
};
export declare type MutationResetPasswordArgs = {
    email: Scalars['String'];
};
export declare type MutationLoginArgs = {
    email: Scalars['String'];
    password: Scalars['String'];
};
export declare type MutationSignupArgs = {
    email: Scalars['String'];
    phoneNumber: Scalars['String'];
    password: Scalars['String'];
};
export declare type MutationUpdateUserArgs = {
    phoneNumber?: Maybe<Scalars['String']>;
    password?: Maybe<Scalars['String']>;
};
export declare type MutationCreateGroupArgs = {
    organizationId: Scalars['Int'];
    name: Scalars['String'];
    groupNotificationSetting: GroupNotificationSettingInput;
};
export declare type MutationDeleteGroupArgs = {
    groupId: Scalars['Int'];
};
export declare type MutationUpdateGroupNotificationOptionsArgs = {
    groupId: Scalars['Int'];
    groupNotificationSetting: GroupNotificationSettingInput;
};
export declare type MutationInviteUsersArgs = {
    groupId: Scalars['Int'];
    users?: Maybe<Array<Maybe<InvitedGroupUser>>>;
};
export declare type MutationUpdateInviteArgs = {
    groupId: Scalars['Int'];
    response: Scalars['String'];
};
export declare type MutationRemoveMembersArgs = {
    memberIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};
export declare type MutationCreateEvacuationEventArgs = {
    groupId: Scalars['Int'];
    msg: Scalars['String'];
};
export declare type MutationUpdateEvacuationEventArgs = {
    evacuationEventId: Scalars['Int'];
    status: Scalars['String'];
};
export declare type MutationCreateEvacuationEventResponseArgs = {
    evacuationEventId: Scalars['Int'];
    response: Scalars['String'];
};
export declare type MutationCreateOrganizationArgs = {
    name: Scalars['String'];
};
export declare type MutationDeleteOrganizationArgs = {
    organizationId: Scalars['Int'];
};
export declare type MutationInviteToOrganizationArgs = {
    organizationId: Scalars['Int'];
    users?: Maybe<Array<Maybe<InvitedOrganizationUser>>>;
};
export declare type MutationUpdateOrgInviteArgs = {
    organizationId: Scalars['Int'];
    status: Scalars['String'];
};
export declare type MutationRemoveFromOrganizationArgs = {
    organizationId: Scalars['Int'];
    memberIds?: Maybe<Array<Maybe<Scalars['Int']>>>;
};
export declare type MutationSendOrganizationNotificationArgs = {
    organizationId: Scalars['Int'];
    message: Scalars['String'];
};
export declare type Organization = {
    __typename?: 'Organization';
    id: Scalars['Int'];
    name: Scalars['String'];
    members?: Maybe<Array<Maybe<OrganizationMember>>>;
    groups?: Maybe<Array<Maybe<Group>>>;
};
export declare type OrganizationMember = {
    __typename?: 'OrganizationMember';
    id: Scalars['Int'];
    userId: Scalars['Int'];
    organizationId: Scalars['Int'];
    status: Scalars['String'];
    admin: Scalars['Boolean'];
    user?: Maybe<User>;
    organization?: Maybe<Organization>;
};
export declare type Query = {
    __typename?: 'Query';
    getOrganizations?: Maybe<Array<Maybe<OrganizationMember>>>;
    getOrganization?: Maybe<Organization>;
    getGroup?: Maybe<Group>;
    getGroupMembers?: Maybe<Array<Maybe<GroupMember>>>;
    getEvacuationEvents?: Maybe<Array<Maybe<EvacuationEvent>>>;
};
export declare type QueryGetOrganizationArgs = {
    organizationId: Scalars['Int'];
};
export declare type QueryGetGroupArgs = {
    groupId: Scalars['Int'];
};
export declare type QueryGetGroupMembersArgs = {
    groupId: Scalars['Int'];
};
export declare type QueryGetEvacuationEventsArgs = {
    groupId: Scalars['Int'];
};
export declare enum Scopes {
    GroupAdmin = "GROUP_ADMIN",
    OrgAdmin = "ORG_ADMIN"
}
export declare type User = {
    __typename?: 'User';
    id: Scalars['Int'];
    email: Scalars['String'];
    phoneNumber?: Maybe<Scalars['String']>;
    firstName?: Maybe<Scalars['String']>;
    lastName?: Maybe<Scalars['String']>;
    passwordHash?: Maybe<Scalars['String']>;
    accountCreated: Scalars['Boolean'];
    organizations?: Maybe<Array<Maybe<OrganizationMember>>>;
    groups?: Maybe<Array<Maybe<GroupMember>>>;
    evacuationResponses?: Maybe<Array<Maybe<EvacuationResponse>>>;
};
export declare type ResolverTypeWrapper<T> = Promise<T> | T;
export declare type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export declare type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs> | StitchingResolver<TResult, TParent, TContext, TArgs>;
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export declare type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;
export declare type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
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
export declare type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export declare type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export declare type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export declare type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export declare type NextResolverFn<T> = () => Promise<T>;
export declare type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export declare type ResolversTypes = {
    Auth: ResolverTypeWrapper<Auth>;
    String: ResolverTypeWrapper<Scalars['String']>;
    EvacuationEvent: ResolverTypeWrapper<EvacuationEvent>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    EvacuationResponse: ResolverTypeWrapper<EvacuationResponse>;
    Group: ResolverTypeWrapper<Group>;
    GroupMember: ResolverTypeWrapper<GroupMember>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
    GroupNotificationSetting: ResolverTypeWrapper<GroupNotificationSetting>;
    GroupNotificationSettingInput: GroupNotificationSettingInput;
    InvitedGroupUser: InvitedGroupUser;
    InvitedOrganizationUser: InvitedOrganizationUser;
    MemberInviteStatus: MemberInviteStatus;
    Mutation: ResolverTypeWrapper<{}>;
    Organization: ResolverTypeWrapper<Organization>;
    OrganizationMember: ResolverTypeWrapper<OrganizationMember>;
    Query: ResolverTypeWrapper<{}>;
    Scopes: Scopes;
    User: ResolverTypeWrapper<User>;
};
/** Mapping between all available schema types and the resolvers parents */
export declare type ResolversParentTypes = {
    Auth: Auth;
    String: Scalars['String'];
    EvacuationEvent: EvacuationEvent;
    Int: Scalars['Int'];
    EvacuationResponse: EvacuationResponse;
    Group: Group;
    GroupMember: GroupMember;
    Boolean: Scalars['Boolean'];
    GroupNotificationSetting: GroupNotificationSetting;
    GroupNotificationSettingInput: GroupNotificationSettingInput;
    InvitedGroupUser: InvitedGroupUser;
    InvitedOrganizationUser: InvitedOrganizationUser;
    Mutation: {};
    Organization: Organization;
    OrganizationMember: OrganizationMember;
    Query: {};
    User: User;
};
export declare type AuthResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Auth'] = ResolversParentTypes['Auth']> = {
    token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type EvacuationEventResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvacuationEvent'] = ResolversParentTypes['EvacuationEvent']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    startTime?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    endTime?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    createdBy?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    responses?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvacuationResponse']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type EvacuationResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['EvacuationResponse'] = ResolversParentTypes['EvacuationResponse']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    response?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    evacuationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type GroupResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Group'] = ResolversParentTypes['Group']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    notificationSetting?: Resolver<Maybe<ResolversTypes['GroupNotificationSetting']>, ParentType, ContextType>;
    members?: Resolver<Maybe<Array<Maybe<ResolversTypes['GroupMember']>>>, ParentType, ContextType>;
    evacuationEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvacuationEvent']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type GroupMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupMember'] = ResolversParentTypes['GroupMember']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    group?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type GroupNotificationSettingResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GroupNotificationSetting'] = ResolversParentTypes['GroupNotificationSetting']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    groupId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    emailEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    pushEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    smsEnabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
    resetPassword?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'email'>>;
    login?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType, RequireFields<MutationLoginArgs, 'email' | 'password'>>;
    signup?: Resolver<Maybe<ResolversTypes['Auth']>, ParentType, ContextType, RequireFields<MutationSignupArgs, 'email' | 'phoneNumber' | 'password'>>;
    deleteUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    updateUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, never>>;
    createGroup?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<MutationCreateGroupArgs, 'organizationId' | 'name' | 'groupNotificationSetting'>>;
    deleteGroup?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<MutationDeleteGroupArgs, 'groupId'>>;
    updateGroupNotificationOptions?: Resolver<Maybe<ResolversTypes['GroupNotificationSetting']>, ParentType, ContextType, RequireFields<MutationUpdateGroupNotificationOptionsArgs, 'groupId' | 'groupNotificationSetting'>>;
    inviteUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['GroupMember']>>>, ParentType, ContextType, RequireFields<MutationInviteUsersArgs, 'groupId'>>;
    updateInvite?: Resolver<Maybe<ResolversTypes['GroupMember']>, ParentType, ContextType, RequireFields<MutationUpdateInviteArgs, 'groupId' | 'response'>>;
    removeMembers?: Resolver<Maybe<Array<Maybe<ResolversTypes['GroupMember']>>>, ParentType, ContextType, RequireFields<MutationRemoveMembersArgs, never>>;
    createEvacuationEvent?: Resolver<Maybe<ResolversTypes['EvacuationEvent']>, ParentType, ContextType, RequireFields<MutationCreateEvacuationEventArgs, 'groupId' | 'msg'>>;
    updateEvacuationEvent?: Resolver<Maybe<ResolversTypes['EvacuationEvent']>, ParentType, ContextType, RequireFields<MutationUpdateEvacuationEventArgs, 'evacuationEventId' | 'status'>>;
    createEvacuationEventResponse?: Resolver<Maybe<ResolversTypes['EvacuationResponse']>, ParentType, ContextType, RequireFields<MutationCreateEvacuationEventResponseArgs, 'evacuationEventId' | 'response'>>;
    createOrganization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<MutationCreateOrganizationArgs, 'name'>>;
    deleteOrganization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<MutationDeleteOrganizationArgs, 'organizationId'>>;
    inviteToOrganization?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrganizationMember']>>>, ParentType, ContextType, RequireFields<MutationInviteToOrganizationArgs, 'organizationId'>>;
    updateOrgInvite?: Resolver<Maybe<ResolversTypes['OrganizationMember']>, ParentType, ContextType, RequireFields<MutationUpdateOrgInviteArgs, 'organizationId' | 'status'>>;
    removeFromOrganization?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrganizationMember']>>>, ParentType, ContextType, RequireFields<MutationRemoveFromOrganizationArgs, 'organizationId'>>;
    sendOrganizationNotification?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<MutationSendOrganizationNotificationArgs, 'organizationId' | 'message'>>;
};
export declare type OrganizationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Organization'] = ResolversParentTypes['Organization']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    members?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrganizationMember']>>>, ParentType, ContextType>;
    groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['Group']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type OrganizationMemberResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrganizationMember'] = ResolversParentTypes['OrganizationMember']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    userId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    organizationId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    admin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
    organization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    getOrganizations?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrganizationMember']>>>, ParentType, ContextType>;
    getOrganization?: Resolver<Maybe<ResolversTypes['Organization']>, ParentType, ContextType, RequireFields<QueryGetOrganizationArgs, 'organizationId'>>;
    getGroup?: Resolver<Maybe<ResolversTypes['Group']>, ParentType, ContextType, RequireFields<QueryGetGroupArgs, 'groupId'>>;
    getGroupMembers?: Resolver<Maybe<Array<Maybe<ResolversTypes['GroupMember']>>>, ParentType, ContextType, RequireFields<QueryGetGroupMembersArgs, 'groupId'>>;
    getEvacuationEvents?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvacuationEvent']>>>, ParentType, ContextType, RequireFields<QueryGetEvacuationEventsArgs, 'groupId'>>;
};
export declare type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
    id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    passwordHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    accountCreated?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
    organizations?: Resolver<Maybe<Array<Maybe<ResolversTypes['OrganizationMember']>>>, ParentType, ContextType>;
    groups?: Resolver<Maybe<Array<Maybe<ResolversTypes['GroupMember']>>>, ParentType, ContextType>;
    evacuationResponses?: Resolver<Maybe<Array<Maybe<ResolversTypes['EvacuationResponse']>>>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type Resolvers<ContextType = Context> = {
    Auth?: AuthResolvers<ContextType>;
    EvacuationEvent?: EvacuationEventResolvers<ContextType>;
    EvacuationResponse?: EvacuationResponseResolvers<ContextType>;
    Group?: GroupResolvers<ContextType>;
    GroupMember?: GroupMemberResolvers<ContextType>;
    GroupNotificationSetting?: GroupNotificationSettingResolvers<ContextType>;
    Mutation?: MutationResolvers<ContextType>;
    Organization?: OrganizationResolvers<ContextType>;
    OrganizationMember?: OrganizationMemberResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
    User?: UserResolvers<ContextType>;
};
/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export declare type IResolvers<ContextType = Context> = Resolvers<ContextType>;
