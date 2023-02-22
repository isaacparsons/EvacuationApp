"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgMemberFromAnnouncementId = void 0;
const getOrgMemberFromAnnouncementId = async (db, userId, announcementId) => {
    const organization = await db.announcement.findUnique({
        where: {
            id: announcementId
        }
    });
    if (!organization) {
        return new Error("Organization does not exist");
    }
    const member = await db.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId: organization.organizationId
            }
        }
    });
    return member;
};
exports.getOrgMemberFromAnnouncementId = getOrgMemberFromAnnouncementId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JnTWVtYmVyRnJvbUFubm91bmNlbWVudElkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Blcm1pc3Npb25zL3V0aWxzL2dldE9yZ01lbWJlckZyb21Bbm5vdW5jZW1lbnRJZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLDhCQUE4QixHQUFHLEtBQUssRUFDakQsRUFBZ0IsRUFDaEIsTUFBYyxFQUNkLGNBQXNCLEVBQ3RCLEVBQUU7SUFDRixNQUFNLFlBQVksR0FBRyxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1FBQ3BELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxjQUFjO1NBQ25CO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUNqQixPQUFPLElBQUksS0FBSyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDakQ7SUFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFDcEQsS0FBSyxFQUFFO1lBQ0wscUJBQXFCLEVBQUU7Z0JBQ3JCLE1BQU07Z0JBQ04sY0FBYyxFQUFFLFlBQVksQ0FBQyxjQUFjO2FBQzVDO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUF0QlcsUUFBQSw4QkFBOEIsa0NBc0J6QyJ9