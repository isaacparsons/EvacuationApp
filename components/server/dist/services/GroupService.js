"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembers = exports.updateGroupMember = exports.addUsersToGroup = exports.addUsersToGroups = exports.updateGroupNotificationOptions = exports.deleteGroup = exports.createGroup = exports.getAcceptedUsersByGroupIds = exports.getGroupWithAcceptedMembers = exports.getGroupMembers = exports.getGroupForUser = exports.getGroup = void 0;
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
            notificationSetting: true
        }
    });
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
const getGroupWithAcceptedMembers = async (data) => {
    const { groupId, context } = data;
    const group = await context.db.group.findUnique({
        where: {
            id: groupId
        },
        include: {
            members: {
                where: {
                    organizationMember: {
                        status: "accepted"
                    }
                },
                include: {
                    user: true
                }
            },
            notificationSetting: true
        }
    });
    if (!group) {
        throw new errors_1.RequestError(`No group exists with id: ${groupId}`);
    }
    return group;
};
exports.getGroupWithAcceptedMembers = getGroupWithAcceptedMembers;
const getAcceptedUsersByGroupIds = async (data) => {
    const { context, groupIds } = data;
    const uniqueUsers = new Map();
    const groups = await context.db.group.findMany({
        where: {
            OR: groupIds.map((id) => ({ id: id }))
        },
        include: {
            members: {
                where: {
                    organizationMember: {
                        status: "accepted"
                    }
                },
                include: {
                    user: true
                }
            }
        }
    });
    groups.forEach((group) => {
        group.members.forEach((member) => {
            uniqueUsers.set(member.userId, member.user);
        });
    });
    const users = Array.from(uniqueUsers).map((item) => item[1]);
    return users;
};
exports.getAcceptedUsersByGroupIds = getAcceptedUsersByGroupIds;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0dyb3VwU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSwyQ0FBOEM7QUFFdkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQTJDLEVBQUUsRUFBRTtJQUM1RSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsQyxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsT0FBTztTQUNaO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtvQkFDVixrQkFBa0IsRUFBRSxJQUFJO2lCQUN6QjthQUNGO1lBQ0QsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQjtLQUNGLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixNQUFNLElBQUkscUJBQVksQ0FBQyxpQ0FBaUMsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNwRTtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBckJXLFFBQUEsUUFBUSxZQXFCbkI7QUFFSyxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQUUsSUFBMkMsRUFBRSxFQUFFO0lBQ25GLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRWxDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFLLENBQUMsRUFBRSxDQUFDO0lBQ2hDLE1BQU0sS0FBSyxHQUFHLE1BQU0sT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQzdDLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxNQUFNO1NBQ1g7UUFDRCxPQUFPLEVB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