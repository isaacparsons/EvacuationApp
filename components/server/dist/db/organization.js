"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OrganizationRepository {
    constructor(db) {
        this.getOrganizationsForUser = async (data) => {
            const { userId } = data;
            const organizations = await this.db.organizationMember.findMany({
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
        this.getOrganization = async (data) => {
            const { organizationId } = data;
            const organization = await this.db.organization.findUnique({
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
        this.getOrganizationById = async (data) => {
            const { organizationId } = data;
            const organization = await this.db.organization.findUnique({
                where: {
                    id: organizationId
                }
            });
            return organization;
        };
        this.getAnnouncementById = async (data) => {
            const { announcementId } = data;
            const announcement = await this.db.announcement.findUnique({
                where: {
                    id: announcementId
                }
            });
            return announcement;
        };
        this.getOrganizationMembers = async (data) => {
            const { organizationId, cursor } = data;
            const organizationMembers = await this.db.organizationMember.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
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
        this.getOrganizationMember = async (data) => {
            const { organizationId, userId } = data;
            const organizationMember = await this.db.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId: organizationId
                    }
                }
            });
            return organizationMember;
        };
        this.getOrgWithAcceptedMembers = async (data) => {
            const { organizationId } = data;
            const organization = await this.db.organization.findUnique({
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
            return organization;
        };
        this.getOrganizationForUser = async (data) => {
            const { organizationId } = data;
            const organization = await this.db.organization.findUnique({
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
            return organization;
        };
        this.createOrganization = async (data) => {
            const { name, organizationNotificationSetting, userId } = data;
            const organization = await this.db.organization.create({
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
        this.deleteOrganization = async (data) => {
            const { organizationId } = data;
            const organization = await this.db.organization.delete({
                where: {
                    id: organizationId
                }
            });
            return organization;
        };
        this.updateOrganizationNotificationOptions = async (data) => {
            const { organizationId, organizationNotificationSetting } = data;
            const setting = await this.db.organizationNotificationSetting.update({
                where: {
                    organizationId
                },
                data: organizationNotificationSetting
            });
            return setting;
        };
        this.createOrganizationMember = async (data) => {
            const { admin, email, organizationId } = data;
            const member = await this.db.organizationMember.create({
                data: {
                    status: "pending",
                    admin: admin,
                    organization: {
                        connect: { id: organizationId }
                    },
                    user: {
                        connectOrCreate: {
                            where: {
                                email: email.toLowerCase()
                            },
                            create: {
                                email: email.toLowerCase(),
                                accountCreated: false
                            }
                        }
                    }
                },
                include: { user: true }
            });
            return member;
        };
        this.updateOrgInvite = async (data) => {
            const { organizationId, status, userId } = data;
            if (status === "declined") {
                const orgMember = await this.db.organizationMember.delete({
                    where: {
                        userId_organizationId: {
                            userId: userId,
                            organizationId
                        }
                    }
                });
                return orgMember;
            }
            if (status === "accepted") {
                const orgMember = await this.db.organizationMember.update({
                    where: {
                        userId_organizationId: {
                            userId: userId,
                            organizationId
                        }
                    },
                    data: {
                        status
                    }
                });
                return orgMember;
            }
        };
        this.removeFromOrganization = async (data) => {
            const { userId, organizationId } = data;
            return await this.db.organizationMember.delete({
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
        };
        this.createOrganizationAnnouncement = async (data) => {
            const { title, description, organizationId, userId } = data;
            const announcement = await this.db.announcement.create({
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
        this.deleteOrganizationAnnouncement = async (data) => {
            const { announcementId } = data;
            const announcement = await this.db.announcement.delete({
                where: {
                    id: announcementId
                }
            });
            return announcement;
        };
        this.getAnnouncements = async (data) => {
            const { organizationId, cursor } = data;
            const announcements = await this.db.announcement.findMany(Object.assign(Object.assign(Object.assign({}, (cursor && { skip: 1 })), (cursor && {
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
        this.db = db;
    }
}
exports.default = OrganizationRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RiL29yZ2FuaXphdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE1BQXFCLHNCQUFzQjtJQUd6QyxZQUFZLEVBQWdCO1FBSTVCLDRCQUF1QixHQUFHLEtBQUssRUFBRSxJQUF3QixFQUFFLEVBQUU7WUFDM0QsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztZQUN4QixNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDO2dCQUM5RCxLQUFLLEVBQUU7b0JBQ0wsTUFBTTtpQkFDUDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsWUFBWSxFQUFFO3dCQUNaLE9BQU8sRUFBRTs0QkFDUCxPQUFPLEVBQUUsSUFBSTt5QkFDZDtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLG9CQUFlLEdBQUcsS0FBSyxFQUFFLElBQWdDLEVBQUUsRUFBRTtZQUMzRCxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2dCQUN6RCxLQUFLLEVBQUU7b0JBQ0wsRUFBRSxFQUFFLGNBQWM7aUJBQ25CO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxNQUFNLEVBQUUsSUFBSTtvQkFDWixPQUFPLEVBQUU7d0JBQ1AsT0FBTyxFQUFFOzRCQUNQLElBQUksRUFBRSxJQUFJO3lCQUNYO3FCQUNGO29CQUNELG1CQUFtQixFQUFFLElBQUk7b0JBQ3pCLGFBQWEsRUFBRSxJQUFJO2lCQUNwQjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU8sWUFBWSxDQUFDO1FBQ3RCLENBQUMsQ0FBQztRQUVGLHdCQUFtQixHQUFHLEtB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