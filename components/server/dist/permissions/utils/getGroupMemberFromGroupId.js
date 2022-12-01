"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroupMemberFromGroupId = void 0;
const getGroupMemberFromGroupId = async (db, userId, groupId) => {
    const member = await db.groupMember.findUnique({
        where: {
            userId_groupId: {
                userId,
                groupId
            }
        }
    });
    return member;
};
exports.getGroupMemberFromGroupId = getGroupMemberFromGroupId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R3JvdXBNZW1iZXJGcm9tR3JvdXBJZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wZXJtaXNzaW9ucy91dGlscy9nZXRHcm91cE1lbWJlckZyb21Hcm91cElkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVPLE1BQU0seUJBQXlCLEdBQUcsS0FBSyxFQUM1QyxFQUFnQixFQUNoQixNQUFjLEVBQ2QsT0FBZSxFQUNmLEVBQUU7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDO1FBQzdDLEtBQUssRUFBRTtZQUNMLGNBQWMsRUFBRTtnQkFDZCxNQUFNO2dCQUNOLE9BQU87YUFDUjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBZFcsUUFBQSx5QkFBeUIsNkJBY3BDIn0=