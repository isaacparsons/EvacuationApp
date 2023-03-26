"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupRepository {
    constructor(db) {
        this.getGroupById = async (data) => {
            const { groupId } = data;
            const group = await this.db.group.findUnique({
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
            return group;
        };
        this.getGroupForUser = async (data) => {
            const { userId, groupId } = data;
            const group = await this.db.user.findUnique({
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
            return (group === null || group === void 0 ? void 0 : group.groups) && group.groups.length > 0 ? group === null || group === void 0 ? void 0 : group.groups[0].group : null;
        };
        this.getGroupsForUserInOrganization = async (data) => {
            var _a;
            const { userId, organizationId } = data;
            const groups = await this.db.user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    groups: {
                        where: {
                            group: {
                                organizationId
                            }
                        },
                        include: {
                            group: true,
                            organizationMember: true
                        }
                    }
                }
            });
            return (_a = groups === null || groups === void 0 ? void 0 : groups.groups) !== null && _a !== void 0 ? _a : [];
        };
        this.getGroupMembers = async (data) => {
            const { groupId, cursor } = data;
            const groupMembers = await this.db.groupMember.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
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
        this.getGroupMember = async (data) => {
            const { userId, groupId } = data;
            const groupMember = await this.db.groupMember.findUnique({
                where: {
                    userId_groupId: {
                        userId,
                        groupId
                    }
                }
            });
            return groupMember;
        };
        this.getGroupWithAcceptedMembers = async (data) => {
            const { groupId } = data;
            const group = await this.db.group.findUnique({
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
            return group;
        };
        this.getAcceptedUsersByGroupIds = async (data) => {
            const { groupIds } = data;
            const uniqueUsers = new Map();
            const groups = await this.db.group.findMany({
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
        this.createGroup = async (data) => {
            const { name, userId, groupNotificationSetting, organizationId } = data;
            const group = await this.db.group.create({
                data: {
                    name,
                    organizationId,
                    members: {
                        create: {
                            admin: true,
                            organizationMember: {
                                connect: {
                                    userId_organizationId: {
                                        userId: userId,
                                        organizationId
                                    }
                                }
                            },
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
        this.deleteGroup = async (data) => {
            const { groupId } = data;
            const group = await this.db.group.delete({
                where: {
                    id: groupId
                }
            });
            return group;
        };
        this.updateGroupNotificationOptions = async (data) => {
            const { groupId, groupNotificationSetting } = data;
            const setting = await this.db.groupNotificationSetting.update({
                where: {
                    groupId
                },
                data: groupNotificationSetting
            });
            return setting;
        };
        this.createGroupMember = async (data) => {
            const { userId, organizationId, groupId, admin } = data;
            return await this.db.groupMember.create({
                data: {
                    organizationMember: {
                        connect: {
                            userId_organizationId: {
                                userId,
                                organizationId
                            }
                        }
                    },
                    admin,
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
        };
        this.updateGroupMember = async (data) => {
            const { groupId, userId, admin } = data;
            const groupMember = await this.db.groupMember.update({
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
        this.removeMember = async (data) => {
            const { groupId, userId } = data;
            return await this.db.groupMember.delete({
                where: {
                    userId_groupId: {
                        userId,
                        groupId
                    }
                }
            });
        };
        this.db = db;
    }
}
exports.default = GroupRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGIvZ3JvdXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxNQUFxQixlQUFlO0lBR2xDLFlBQVksRUFBZ0I7UUFJNUIsaUJBQVksR0FBRyxLQUFLLEVBQUUsSUFBeUIsRUFBRSxFQUFFO1lBQ2pELE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFFekIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7Z0JBQzNDLEtBQUssRUFBRTtvQkFDTCxFQUFFLEVBQUUsT0FBTztpQkFDWjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRTs0QkFDUCxJQUFJLEVBQUUsSUFBSTs0QkFDVixrQkFBa0IsRUFBRSxJQUFJO3lCQUN6QjtxQkFDRjtvQkFDRCxtQkFBbUIsRUFBRSxJQUFJO2lCQUMxQjthQUNGLENBQUMsQ0FBQztZQUNILE9BQU8sS0FBSyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBRUYsb0JBQWUsR0FBRyxLQUFLLEVBQUUsSUFBeUMsRUFBRSxFQUFFO1lBQ3BFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRWpDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUMxQyxLQUFLLEVBQUU7b0JBQ0wsRUFBRSxFQUFFLE1BQU07aUJBQ1g7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUU7NEJBQ0wsT0FBTzt5QkFDUjt3QkFDRCxPQUFPLEVBQUU7NEJBQ1AsS0FBSyxFQUFFO2dDQUNMLE9BQU8sRUFBRTtvQ0FDUCxPQUFPLEVBQUU7d0NBQ1AsT0FBTyxFQUFFOzRDQUNQLElBQUksRUFBRSxJQUFJOzRDQUNWLGtCQUFr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