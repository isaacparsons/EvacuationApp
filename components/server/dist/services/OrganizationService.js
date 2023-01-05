"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationAnnouncement = exports.createOrganizationAnnouncement = exports.removeFromOrganization = exports.updateOrgInvite = exports.inviteToOrganization = exports.updateOrganizationNotificationOptions = exports.deleteOrganization = exports.createOrganization = exports.getOrganizationForUser = exports.getOrganization = exports.getOrganizationsForUser = void 0;
const client_1 = require("@prisma/client");
const getOrganizationsForUser = async (data) => {
    const { userId, db } = data;
    const organizations = await db.organizationMember.findMany({
        where: {
            userId
        },
        include: {
            organization: {
                include: {
                    members: true
                }
            }
        }
    });
    return organizations;
};
exports.getOrganizationsForUser = getOrganizationsForUser;
const getOrganization = async (data) => {
    const { organizationId, db } = data;
    const organization = await db.organization.findUnique({
        where: {
            id: organizationId
        },
        include: {
            groups: true,
            members: {
                include: {
                    user: true
                }
            },
            notificationSetting: true,
            announcements: true
        }
    });
    return organization;
};
exports.getOrganization = getOrganization;
const getOrganizationForUser = async (data) => {
    const { db, userId, organizationId } = data;
    const organization = await db.organization.findUnique({
        where: {
            id: organizationId
        },
        include: {
            members: {
                include: {
                    user: true
                }
            },
            notificationSetting: true,
            announcements: true
        }
    });
    const allGroups = await db.user.findUnique({
        where: {
            id: userId
        },
        include: {
            groups: {
                include: {
                    group: true
                }
            }
        }
    });
    const groups = allGroups
        ? allGroups.groups.filter((groupMember) => groupMember.group.organizationId === organizationId)
        : [];
    return Object.assign(Object.assign({}, organization), { groups });
};
exports.getOrganizationForUser = getOrganizationForUser;
const createOrganization = async (data) => {
    const { name, userId, db, organizationNotificationSetting } = data;
    const organization = await db.organization.create({
        data: {
            name,
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
                create: organizationNotificationSetting
            }
        },
        include: {
            groups: true,
            notificationSetting: true,
            members: {
                include: {
                    user: true
                }
            }
        }
    });
    return organization;
};
exports.createOrganization = createOrganization;
const deleteOrganization = async (data) => {
    const { organizationId, db } = data;
    const organization = await db.organization.delete({
        where: {
            id: organizationId
        }
    });
    return organization;
};
exports.deleteOrganization = deleteOrganization;
const updateOrganizationNotificationOptions = async (data) => {
    const { organizationId, organizationNotificationSetting, db } = data;
    const setting = await db.organizationNotificationSetting.update({
        where: {
            organizationId
        },
        data: organizationNotificationSetting
    });
    return setting;
};
exports.updateOrganizationNotificationOptions = updateOrganizationNotificationOptions;
const inviteToOrganization = async (data) => {
    const { users, organizationId, db } = data;
    const orgMembers = await Promise.all(users.map(async (user) => {
        const orgMember = await db.organizationMember.create({
            data: {
                status: "pending",
                admin: user.admin,
                organization: {
                    connect: { id: organizationId }
                },
                user: {
                    connectOrCreate: {
                        where: {
                            email: user.email
                        },
                        create: {
                            email: user.email,
                            accountCreated: false
                        }
                    }
                }
            },
            include: { user: true, organization: true }
        });
        return orgMember;
    }));
    return orgMembers;
};
exports.inviteToOrganization = inviteToOrganization;
const updateOrgInvite = async (data) => {
    const { organizationId, status, userId, db } = data;
    if (status === "declined") {
        const orgMember = await db.organizationMember.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId
                }
            }
        });
        return orgMember;
    }
    const orgMember = await db.organizationMember.update({
        where: {
            userId_organizationId: {
                userId,
                organizationId
            }
        },
        data: {
            status
        }
    });
    return orgMember;
};
exports.updateOrgInvite = updateOrgInvite;
const removeFromOrganization = async (data) => {
    const { userIds, organizationId, db } = data;
    return Promise.all(userIds.map(async (userId) => {
        try {
            return await db.organizationMember.delete({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId
                    }
                },
                include: {
                    user: true
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
exports.removeFromOrganization = removeFromOrganization;
const createOrganizationAnnouncement = async (data) => {
    const { title, description, userId, organizationId, db } = data;
    const announcement = await db.announcement.create({
        data: {
            title,
            description,
            date: new Date().toISOString(),
            createdBy: userId,
            organizationId
        }
    });
    return announcement;
};
exports.createOrganizationAnnouncement = createOrganizationAnnouncement;
const deleteOrganizationAnnouncement = async (data) => {
    const { announcementId, db } = data;
    const announcement = await db.announcement.delete({
        where: {
            id: announcementId
        }
    });
    return announcement;
};
exports.deleteOrganizationAnnouncement = deleteOrganizationAnnouncement;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Pcmdhbml6YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFzRDtBQXdGL0MsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQUUsSUFBMkIsRUFBRSxFQUFFO0lBQzNFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzVCLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUN6RCxLQUFLLEVBQUU7WUFDTCxNQUFNO1NBQ1A7UUFDRCxPQUFPLEVBQUU7WUFDUCxZQUFZLEVBQUU7Z0JBQ1osT0FBTyxFQUFFO29CQUNQLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQWhCVyxRQUFBLHVCQUF1QiwyQkFnQmxDO0FBRUssTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLElBQTBCLEVBQUUsRUFBRTtJQUNsRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQztJQUNwQyxNQUFNLFlBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBQ3BELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxjQUFjO1NBQ25CO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsTUFBTSxFQUFFLElBQUk7WUFDWixPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJO2lCQUNYO2FBQ0Y7WUFDRCxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGFBQWEsRUFBRSxJQUFJO1NBQ3BCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxZQUFZLENBQUM7QUFDdEIsQ0FBQyxDQUFDO0FB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