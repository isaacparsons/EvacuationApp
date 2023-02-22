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
                    user: true
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
                                    user: true
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
    console.log(groupMembers);
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
                                    userId: userId,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0dyb3VwU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSwyQ0FBOEM7QUFHdkMsTUFBTSxRQUFRLEdBQUcsS0FBSyxFQUFFLElBQTJDLEVBQUUsRUFBRTtJQUM1RSxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVsQyxNQUFNLEtBQUssR0FBRyxNQUFNLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUM5QyxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsT0FBTztTQUNaO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLE9BQU8sRUFBRTtvQkFDUCxTQUFTLEVBQUU7d0JBQ1QsT0FBTyxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFJO3lCQUNYO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxtQkFBbUIsRUFBRSxJQUFJO1NBQzFCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxxQkFBWSxDQUFDLGlDQUFpQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQ3BFO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUE3QlcsUUFBQSxRQUFRLFlBNkJuQjtBQUVLLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxJQUEyQyxFQUFFLEVBQUU7SUFDbkYsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFFbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLElBQUssQ0FBQyxFQUFFLENBQUM7SUFDaEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENB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