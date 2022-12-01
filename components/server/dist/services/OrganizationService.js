"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrganizationAnnouncement = exports.createOrganizationAnnouncement = exports.removeFromOrganization = exports.updateOrgInvite = exports.inviteToOrganization = exports.deleteOrganization = exports.createOrganization = exports.getOrganizationForUser = exports.getOrganization = exports.getOrganizationsForUser = void 0;
const client_1 = require("@prisma/client");
const getOrganizationsForUser = async (data) => {
    const { userId, db } = data;
    const organizations = await db.organizationMember.findMany({
        where: {
            userId
        },
        include: {
            organization: true
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
    const { name, userId, db } = data;
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
            }
        },
        include: {
            groups: true,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Pcmdhbml6YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDJDQUFzRDtBQTJFL0MsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQUUsSUFBMkIsRUFBRSxFQUFFO0lBQzNFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQzVCLE1BQU0sYUFBYSxHQUFHLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUN6RCxLQUFLLEVBQUU7WUFDTCxNQUFNO1NBQ1A7UUFDRCxPQUFPLEVBQUU7WUFDUCxZQUFZLEVBQUUsSUFBSTtTQUNuQjtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQVpXLFFBQUEsdUJBQXVCLDJCQVlsQztBQUVLLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxJQUEwQixFQUFFLEVBQUU7SUFDbEUsTUFBTSxFQUFFLGNBQWMsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDcEMsTUFBTSxZQUFZLEdBQUcsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztRQUNwRCxLQUFLLEVBQUU7WUFDTCxFQUFFLEVBQUUsY0FBYztTQUNuQjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxJQUFJO1lBQ1osT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNGO1lBQ0QsYUFBYSxFQUFFLElBQUk7U0FDcEI7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDLENBQUM7QUFqQlcsUUFBQSxlQUFlLG1CQWlCMUI7QUFFSyxNQUFNLHNCQUFzQixHQUFHLEtBQUssRUFDekMsSUFBaUMsRUFDakMs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