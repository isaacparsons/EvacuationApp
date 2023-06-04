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
        this.getOrganizationMemberByEmail = async (data) => {
            const { organizationId, email } = data;
            const user = await this.db.user.findUnique({
                where: {
                    email: email.toLowerCase()
                }
            });
            if (!user) {
                return null;
            }
            const organizationMember = this.db.organizationMember.findUnique({
                where: {
                    userId_organizationId: {
                        userId: user.id,
                        organizationId: organizationId
                    }
                },
                include: {
                    user: true
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