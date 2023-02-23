"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnouncements = exports.deleteOrganizationAnnouncement = exports.createOrganizationAnnouncement = exports.removeFromOrganization = exports.updateOrgInvite = exports.inviteToOrganization = exports.updateOrganizationNotificationOptions = exports.deleteOrganization = exports.createOrganization = exports.getOrganizationForUser = exports.getOrganizationMembers = exports.getOrganization = exports.getOrganizationsForUser = void 0;
const doesAlreadyExistError_1 = __importDefault(require("../util/doesAlreadyExistError"));
const errors_1 = require("../util/errors");
const getOrganizationsForUser = async (data) => {
    const { context } = data;
    const organizations = await context.db.organizationMember.findMany({
        where: {
            userId: context.user.id
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
    const { organizationId, context } = data;
    const organization = await context.db.organization.findUnique({
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
    if (!organization) {
        throw new errors_1.RequestError(`Organization does not exist with id: ${organizationId}`);
    }
    return organization;
};
exports.getOrganization = getOrganization;
const getOrganizationMembers = async (data) => {
    const { organizationId, context, cursor } = data;
    const organizationMembers = await context.db.organizationMember.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
        cursor: {
            id: cursor
        }
    })), { take: 5, orderBy: {
            id: "asc"
        }, where: {
            organizationId
        }, include: {
            user: true
        } }));
    return {
        data: organizationMembers,
        cursor: organizationMembers.length > 0
            ? organizationMembers[organizationMembers.length - 1].id
            : cursor
    };
};
exports.getOrganizationMembers = getOrganizationMembers;
const getOrganizationForUser = async (data) => {
    const { context, organizationId } = data;
    const organization = await context.db.organization.findUnique({
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
    if (!organization) {
        throw new errors_1.RequestError(`Organization with id: ${organizationId} does not exist`);
    }
    const allGroups = await context.db.user.findUnique({
        where: {
            id: context.user.id
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
    const { name, context, organizationNotificationSetting } = data;
    const organization = await context.db.organization.create({
        data: {
            name,
            members: {
                create: {
                    status: "accepted",
                    admin: true,
                    user: {
                        connect: { id: context.user.id }
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
    const { organizationId, context } = data;
    const organization = await context.db.organization.delete({
        where: {
            id: organizationId
        }
    });
    return organization;
};
exports.deleteOrganization = deleteOrganization;
const updateOrganizationNotificationOptions = async (data) => {
    const { organizationId, organizationNotificationSetting, context } = data;
    const setting = await context.db.organizationNotificationSetting.update({
        where: {
            organizationId
        },
        data: organizationNotificationSetting
    });
    return setting;
};
exports.updateOrganizationNotificationOptions = updateOrganizationNotificationOptions;
const inviteToOrganization = async (data) => {
    const { users, organizationId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(users.map(async (user) => {
        try {
            const member = await context.db.organizationMember.create({
                data: {
                    status: "pending",
                    admin: user.admin,
                    organization: {
                        connect: { id: organizationId }
                    },
                    user: {
                        connectOrCreate: {
                            where: {
                                email: user.email.toLowerCase()
                            },
                            create: {
                                email: user.email.toLowerCase(),
                                accountCreated: false
                            }
                        }
                    }
                },
                include: { user: true }
            });
            succeeded.push(member);
        }
        catch (error) {
            if (!(0, doesAlreadyExistError_1.default)(error)) {
                context.log.error(`Failed to add member with email: ${user.email} to organization: ${organizationId}`, error);
                failed.push(user.email);
            }
        }
    }));
    return {
        succeeded,
        failed
    };
};
exports.inviteToOrganization = inviteToOrganization;
const updateOrgInvite = async (data) => {
    const { organizationId, status, context } = data;
    if (status === "declined") {
        const orgMember = await context.db.organizationMember.delete({
            where: {
                userId_organizationId: {
                    userId: context.user.id,
                    organizationId
                }
            }
        });
        return orgMember;
    }
    const orgMember = await context.db.organizationMember.update({
        where: {
            userId_organizationId: {
                userId: context.user.id,
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
    const { userIds, organizationId, context } = data;
    const succeeded = [];
    const failed = [];
    await Promise.all(userIds.map(async (userId) => {
        try {
            const member = await context.db.organizationMember.delete({
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
            succeeded.push(member);
        }
        catch (error) {
            context.log.error(`Failed to remove member with userId: ${userId} from organization: ${organizationId}`, error);
            failed.push(userId);
        }
    }));
    return {
        succeeded,
        failed
    };
};
exports.removeFromOrganization = removeFromOrganization;
const createOrganizationAnnouncement = async (data) => {
    const { title, description, organizationId, context } = data;
    const announcement = await context.db.announcement.create({
        data: {
            title,
            description,
            date: new Date().toISOString(),
            createdBy: context.user.id,
            organizationId
        }
    });
    return announcement;
};
exports.createOrganizationAnnouncement = createOrganizationAnnouncement;
const deleteOrganizationAnnouncement = async (data) => {
    const { announcementId, context } = data;
    const announcement = await context.db.announcement.delete({
        where: {
            id: announcementId
        }
    });
    return announcement;
};
exports.deleteOrganizationAnnouncement = deleteOrganizationAnnouncement;
const getAnnouncements = async (data) => {
    const { organizationId, context, cursor } = data;
    const announcements = await context.db.announcement.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
        cursor: {
            id: cursor
        }
    })), { take: 5, orderBy: {
            id: "asc"
        }, where: {
            organizationId
        } }));
    return {
        data: announcements,
        cursor: announcements.length > 0 ? announcements[announcements.length - 1].id : cursor
    };
};
exports.getAnnouncements = getAnnouncements;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Pcmdhbml6YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU1BLDBGQUFrRTtBQUNsRSwyQ0FBOEM7QUFFdkMsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQUUsSUFBMEIsRUFBRSxFQUFFO0lBQzFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDekIsTUFBTSxhQUFhLEdBQUcsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUNqRSxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUssQ0FBQyxFQUFFO1NBQ3pCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRTtvQkFDUCxPQUFPLEVBQUUsSUFBSTtpQkFDZDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFoQlcsUUFBQSx1QkFBdUIsMkJBZ0JsQztBQUVLLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxJQUFrRCxFQUFFLEVBQUU7SUFDMUYsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDekMsTUFBTSxZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFDNUQsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLGNBQWM7U0FDbkI7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsSUFBSTtZQUNaLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRjtZQUNELG1CQUFtQixFQUFFLElBQUk7WUFDekIsYUFBYSxFQUFFLElBQUk7U0FD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