"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMembers = exports.updateGroupMember = exports.updateInvite = exports.inviteUsers = exports.updateGroupNotificationOptions = exports.deleteGroup = exports.createGroup = exports.getGroupForUser = exports.getGroup = void 0;
// import { Group, GroupMember, Prisma, PrismaClient } from "@prisma/client";
const client_1 = require("@prisma/client");
const getGroup = async (data) => {
    const { db, groupId } = data;
    const group = await db.group.findUnique({
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
    return group;
};
exports.getGroup = getGroup;
const getGroupForUser = async (data) => {
    const { db, groupId, userId } = data;
    const group = await db.user.findUnique({
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
    return (group === null || group === void 0 ? void 0 : group.groups) ? group === null || group === void 0 ? void 0 : group.groups[0].group : null;
};
exports.getGroupForUser = getGroupForUser;
const createGroup = async (data) => {
    const { name, userId, groupNotificationSetting, organizationId, db } = data;
    const group = await db.group.create({
        data: {
            name,
            organizationId,
            members: {
                create: {
                    status: "accepted",
                    admin: true,
                    user: {
                        connect: { id: userId }
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
    const { groupId, db } = data;
    const group = await db.group.delete({
        where: {
            id: groupId
        }
    });
    return group;
};
exports.deleteGroup = deleteGroup;
const updateGroupNotificationOptions = async (data) => {
    const { groupId, groupNotificationSetting, db } = data;
    const setting = await db.groupNotificationSetting.update({
        where: {
            groupId
        },
        data: groupNotificationSetting
    });
    return setting;
};
exports.updateGroupNotificationOptions = updateGroupNotificationOptions;
const inviteUsers = async (data) => {
    const { users, groupId, db } = data;
    const groupMembers = await Promise.all(users.map(async (user) => {
        const groupMember = await db.groupMember.create({
            data: {
                status: "pending",
                admin: user.admin,
                group: {
                    connect: { id: groupId }
                },
                user: {
                    connect: {
                        email: user.email
                    }
                }
            },
            include: { user: true, group: true }
        });
        return groupMember;
    }));
    return groupMembers;
};
exports.inviteUsers = inviteUsers;
const updateInvite = async (data) => {
    const { groupId, userId, response, db } = data;
    if (response === "declined") {
        const groupMember = await db.groupMember.delete({
            where: {
                userId_groupId: {
                    userId,
                    groupId
                }
            }
        });
        return groupMember;
    }
    const groupMember = await db.groupMember.update({
        where: {
            userId_groupId: {
                userId,
                groupId
            }
        },
        data: {
            status: response
        }
    });
    return groupMember;
};
exports.updateInvite = updateInvite;
const updateGroupMember = async (data) => {
    const { groupId, userId, admin, db } = data;
    const groupMember = await db.groupMember.update({
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
    const { memberIds, db } = data;
    return Promise.all(memberIds.map(async (memberId) => {
        try {
            return await db.groupMember.delete({
                where: {
                    id: memberId
                }
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return null;
                }
            }
        }
    }));
};
exports.removeMembers = removeMembers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JvdXBTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL0dyb3VwU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2RUFBNkU7QUFDN0UsMkNBQTBFO0FBcUVuRSxNQUFNLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBbUIsRUFBRSxFQUFFO0lBQ3BELE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBRTdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtRQUNELE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRjtZQUNELGdCQUFnQixFQUFFO2dCQUNoQixPQUFPLEVBQUU7b0JBQ1AsU0FBUyxFQUFFO3dCQUNULE9BQU8sRUFBRTs0QkFDUCxJQUFJLEVBQUUsSUFBSTt5QkFDWDtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsbUJBQW1CLEVBQUUsSUFBSTtTQUMxQjtLQUNGLENBQUMsQ0FBQztJQUNILE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBMUJXLFFBQUEsUUFBUSxZQTBCbkI7QUFFSyxNQUFNLGVBQWUsR0FBRyxLQUFLLEVBQUUsSUFBMEIsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztJQUVyQyxNQUFNLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1FBQ3JDLEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxNQUFNO1NBQ1g7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFO29CQUNMLE9BQU87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