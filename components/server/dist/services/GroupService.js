"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembers = exports.updateGroupMember = exports.addUsersToGroup = exports.addUsersToGroups = exports.updateGroupNotificationOptions = exports.deleteGroup = exports.createGroup = exports.getGroupMembers = exports.getGroupForUser = exports.getGroup = void 0;
const errors_1 = require("../util/errors");
const getGroup = async (data) => {
    const { context, groupId } = data;
    const group = await context.db.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            members: {
                include: {
                    user: true,
                    organizationMember: true
                }
            },
            evacuationEvents: {
                include: {
                    responses: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            notificationSetting: true
        }
    });
    console.log(group);
    if (!group) {
        throw new errors_1.RequestError(`Group does not exist with id: ${groupId}`);
    }
    return group;
};
exports.getGroup = getGroup;
const getGroupForUser = async (data) => {
    const { context, groupId } = data;
    const userId = context.user.id;
    const group = await context.db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            groups: {
                where: {
                    groupId
                },
                include: {
                    group: {
                        include: {
                            members: {
                                include: {
                                    user: true,
                                    organizationMember: true
                                }
                            },
                            evacuationEvents: {
                                where: {
                                    status: "in-progress"
                                },
                                include: {
                                    responses: {
                                        where: {
                                            userId
                                        },
                                        include: {
                                            user: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!group) {
        throw new errors_1.RequestError(`Group with id: ${groupId} does not exist`);
    }
    return group === null || group === void 0 ? void 0 : group.groups[0].group;
};
exports.getGroupForUser = getGroupForUser;
const getGroupMembers = async (data) => {
    const { groupId, context, cursor } = data;
    const groupMembers = await context.db.groupMember.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
        cursor: {
            id: cursor
        }
    })), { take: 5, orderBy: {
            id: "asc"
        }, where: {
            groupId
        }, include: {
            user: true,
            organizationMember: true
        } }));
    return {
        data: groupMembers,
        cursor: groupMembers.length > 0 ? groupMembers[groupMembers.length - 1].id : cursor
    };
};
exports.getGroupMembers = getGroupMembers;
const createGroup = async (data) => {
    const { name, groupNotificationSetting, organizationId, context } = data;
    const group = await context.db.group.create({
        data: {
            name,
            organizationId,
            members: {
                create: {
                    admin: true,
                    organizationMember: {
                        connect: {
                            userId_organizationId: {
                                userId: context.user.id,
                                organizationId
                            }
                        }
                    },
                    user: {
                        connect: { id: context.user.id }
                    }
                }
            },
            notificationSetting: {
                create: groupNotificationSetting
            }
        },
        include: {
            members: true,
            notificationSetting: true
        }
    });
    return group;
};
exports.createGroup = createGroup;
const deleteGroup = async (data) => {
    const { groupId, context } = data;
    const group = await context.db.group.delete({
        where: {
            id: groupId
        }
    });
    return group;
};
exports.deleteGroup = deleteGroup;
const updateGroupNotificationOptions = async (data) => {
    const { groupId, groupNotificationSetting, context } = data;
    const setting = await context.db.groupNotificationSetting.update({
        where: {
            groupId
        },
        data: groupNotificationSetting
    });
    return setting;
};
exports.updateGroupNotificationOptions = updateGroupNotificationOptions;
const addUsersToGroups = async (data) => {
    const { userIds, organizationId, groupIds, context } = data;
    await Promise.all(groupIds.map(async (groupId) => {
        await Promise.all(userIds.map(async (userId) => {
            try {
                await context.db.groupMember.create({
                    data: {
                        organizationMember: {
                            connect: {
                                userId_organizationId: {
                                    userId,
                                    organizationId
                                }
                            }
                        },
                        admin: false,
                        group: {
                            connect: { id: groupId }
                        },
                        user: {
                            connect: {
                                id: userId
                            }
                        }
                    }
                });
            }
            catch (error) {
                context.log.error(`Unable to add user: ${userId} to group with id: ${groupId}`, error);
            }
        }));
    }));
};
exports.addUsersToGroups = addUsersToGroups;
const addUsersToGroup = async (data) => {
    const { users, groupId, context } = data;
    const group = await context.db.group.findUnique({
        where: {
            id: groupId
        }
    });
    if (!group) {
        throw new errors_1.RequestError(`No group with id: ${groupId}`);
    }
    const groupMembers = await Promise.allSettled(users.map(async (user) => {
        try {
            const groupMember = await context.db.groupMember.create({
                data: {
                    organizationMember: {
                        connect: {
                            userId_organizationId: {
                                userId: user.userId,
                                organizationId: group.organizationId
                            }
                        }
                    },
                    admin: user.admin,
                    group: {
                        connect: { id: groupId }
                    },
                    user: {
                        connect: {
                            id: user.userId
                        }
                    }
                },
                include: { user: true, group: true }
            });
            return groupMember;
        }
        catch (error) {
            context.log.error(`Unable to add user: ${user.userId} to group with id: ${groupId}`);
            throw error;
        }
    }));
    return groupMembers
        .filter((item) => item.status === "fulfilled")
        .map((item) => item.value);
};
exports.addUsersToGroup = addUsersToGroup;
const updateGroupMember = async (data) => {
    const { groupId, userId, admin, context } = data;
    if (context.user.id === userId) {
        throw new errors_1.RequestError("Can't edit your own admin status");
    }
    const groupMember = await context.db.groupMember.update({
        where: {
            userId_groupId: {
                userId,
                groupId
            }
        },
        data: {
            admin
        }
    });
    return groupMember;
};
exports.updateGroupMember = updateGroupMember;
const removeMembers = async (data) => {
    const { groupId, userIds, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(userIds.map(async (userId) => {
        try {
            const member = await context.db.groupMember.delete({
                where: {
                    userId_groupId: {
                        userId,
                        groupId
                    }
                }
            });
            succeeded.push(member);
        }
        catch (error) {
            context.log.error(`Failed to remove member with userId: ${userId} from group: ${groupId}`, error);
            failed.push(userId);
        }
    }));
    return {
        succeeded,
        failed
    };
};
exports.removeMembers = removeMembers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0dyb3VwU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSwyQ0FBOEM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQTJDLEVBQUUsRUFBRTtJQUM1RSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsQyxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsT0FBTztTQUNaO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtvQkFDVixrQkFBa0IsRUFBRSxJQUFJO2lCQUN6QjthQUNGO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRTtvQkFDUCxTQUFTLEVBQUU7d0JBQ1QsT0FBTyxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFJO3lCQUNYO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxtQkFBbUIsRUFBRSxJQUFJO1NBQzFCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuQixJQUFJLENBQUMsS0FBSyxFQUFFO1FBQ1YsTUFBTSxJQUFJLHFCQUFZLENBQUMsaUNBQWlDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDcEU7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQS9CVyxRQUFBLFFBQVEsWUErQm5CO0FBRUssTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLElBQTJDLEVBQUUsRUFBRTtJQUNuRixNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsQyxNQUFNLE1BQU0sR0FB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