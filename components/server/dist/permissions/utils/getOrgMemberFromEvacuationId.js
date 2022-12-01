"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgMemberFromEvacuationId = void 0;
const getOrgMemberFromEvacuationId = async (db, userId, evacuationId) => {
    const evacuationEvent = await db.evacuationEvent.findUnique({
        where: {
            id: evacuationId
        }
    });
    if (!evacuationEvent) {
        throw new Error("Evacuation event does not exist");
    }
    const group = await db.group.findUnique({
        where: {
            id: evacuationEvent.groupId
        }
    });
    if (!group) {
        throw new Error("Group does not exist");
    }
    const member = await db.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId: userId,
                organizationId: group.organizationId
            }
        }
    });
    return member;
};
exports.getOrgMemberFromEvacuationId = getOrgMemberFromEvacuationId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JnTWVtYmVyRnJvbUV2YWN1YXRpb25JZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wZXJtaXNzaW9ucy91dGlscy9nZXRPcmdNZW1iZXJGcm9tRXZhY3VhdGlvbklkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVPLE1BQU0sNEJBQTRCLEdBQUcsS0FBSyxFQUMvQyxFQUFnQixFQUNoQixNQUFjLEVBQ2QsWUFBb0IsRUFDcEIsRUFBRTtJQUNGLE1BQU0sZUFBZSxHQUFHLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUM7UUFDMUQsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLFlBQVk7U0FDakI7S0FDRixDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsZUFBZSxFQUFFO1FBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztLQUNwRDtJQUNELE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLGVBQWUsQ0FBQyxPQUFPO1NBQzVCO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNWLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztLQUN6QztJQUNELE1BQU0sTUFBTSxHQUFHLE1BQU0sRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztRQUNwRCxLQUFLLEVBQUU7WUFDTCxxQkFBcUIsRUFBRTtnQkFDckIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO2FBQ3JDO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUE5QlcsUUFBQSw0QkFBNEIsZ0NBOEJ2QyJ9