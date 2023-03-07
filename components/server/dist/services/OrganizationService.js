"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnnouncements = exports.deleteOrganizationAnnouncement = exports.createOrganizationAnnouncement = exports.removeFromOrganization = exports.updateOrgInvite = exports.inviteToOrganization = exports.updateOrganizationNotificationOptions = exports.deleteOrganization = exports.createOrganization = exports.getOrganizationForUser = exports.getOrgWithAcceptedMembers = exports.getOrganizationMembers = exports.getOrganizationById = exports.getOrganization = exports.getOrganizationsForUser = void 0;
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
const getOrganizationById = async (data) => {
    const { organizationId, context } = data;
    const organization = await context.db.organization.findUnique({
        where: {
            id: organizationId
        }
    });
    if (!organization) {
        throw new errors_1.RequestError(`Organization does not exist with id: ${organizationId}`);
    }
    return organization;
};
exports.getOrganizationById = getOrganizationById;
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
const getOrgWithAcceptedMembers = async (data) => {
    const { organizationId, context } = data;
    const organization = await context.db.organization.findUnique({
        where: {
            id: organizationId
        },
        include: {
            members: {
                where: {
                    status: "accepted"
                },
                include: {
                    user: true
                }
            },
            notificationSetting: true
        }
    });
    if (!organization) {
        throw new errors_1.RequestError(`No organization exists with id: ${organizationId}`);
    }
    return organization;
};
exports.getOrgWithAcceptedMembers = getOrgWithAcceptedMembers;
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
                    group: true,
                    organizationMember: true
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
    if (status === "accepted") {
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
    }
    throw new errors_1.RequestError("Not a valid invitation response");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9Pcmdhbml6YXRpb25TZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUtBLDBGQUFrRTtBQUNsRSwyQ0FBOEM7QUFHdkMsTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQUUsSUFBMEIsRUFBRSxFQUFFO0lBQzFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDekIsTUFBTSxhQUFhLEdBQUcsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQztRQUNqRSxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUssQ0FBQyxFQUFFO1NBQ3pCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRTtvQkFDUCxPQUFPLEVBQUUsSUFBSTtpQkFDZDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFoQlcsUUFBQSx1QkFBdUIsMkJBZ0JsQztBQUVLLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxJQUFrRCxFQUFFLEVBQUU7SUFDMUYsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUM7SUFDekMsTUFBTSxZQUFZLEdBQUcsTUFBTSxPQUFPLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7UUFDNUQsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLGNBQWM7U0FDbkI7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsSUFBSTtZQUNaLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUU7b0JBQ1AsSUFBSSxFQUFFLElBQUk7aUJBQ1g7YUFDRjtZQUNELG1CQUFtQixFQUFFLElBQUk7WUFDekIsYUFBYSxFQUFFLElBQUk7U0FD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