"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMemberFromEvacuationId = void 0;
const getGroupMemberFromEvacuationId = async (db, userId, evacuationId) => {
    const evacuationEvent = await db.evacuationEvent.findUnique({
        where: {
            id: evacuationId
        }
    });
    if (!evacuationEvent) {
        throw new Error("Evacuation event does not exist");
    }
    const member = await db.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId: evacuationEvent.groupId
            }
        }
    });
    return member;
};
exports.getGroupMemberFromEvacuationId = getGroupMemberFromEvacuationId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3JvdXBNZW1iZXJGcm9tRXZhY3VhdGlvbklkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Blcm1pc3Npb25zL3V0aWxzL2dldEdyb3VwTWVtYmVyRnJvbUV2YWN1YXRpb25JZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLDhCQUE4QixHQUFHLEtBQUssRUFDakQsRUFBZ0IsRUFDaEIsTUFBYyxFQUNkLFlBQW9CLEVBQ3BCLEVBQUU7SUFDRixNQUFNLGVBQWUsR0FBRyxNQUFNLEVBQUUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQzFELEtBQUssRUFBRTtZQUNMLEVBQUUsRUFBRSxZQUFZO1NBQ2pCO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUNwQixNQUFNLElBQUksS0FBSyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDcEQ7SUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQzdDLEtBQUssRUFBRTtZQUNMLGNBQWMsRUFBRTtnQkFDZCxNQUFNO2dCQUNOLE9BQU8sRUFBRSxlQUFlLENBQUMsT0FBTzthQUNqQztTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBeEJXLFFBQUEsOEJBQThCLGtDQXdCekMifQ==