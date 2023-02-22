"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgMemberFromGroupId = void 0;
const getOrgMemberFromGroupId = async (db, userId, groupId) => {
    const group = await db.group.findUnique({
        where: {
            id: groupId
        }
    });
    if (!group) {
        return new Error("Group does not exist");
    }
    const member = await db.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId: group.organizationId
            }
        }
    });
    return member;
};
exports.getOrgMemberFromGroupId = getOrgMemberFromGroupId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JnTWVtYmVyRnJvbUdyb3VwSWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcGVybWlzc2lvbnMvdXRpbHMvZ2V0T3JnTWVtYmVyRnJvbUdyb3VwSWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sTUFBTSx1QkFBdUIsR0FBRyxLQUFLLEVBQzFDLEVBQWdCLEVBQ2hCLE1BQWMsRUFDZCxPQUFlLEVBQ2YsRUFBRTtJQUNGLE1BQU0sS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDdEMsS0FBSyxFQUFFO1lBQ0wsRUFBRSxFQUFFLE9BQU87U0FDWjtLQUNGLENBQUMsQ0FBQztJQUNILElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDVixPQUFPLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7S0FDMUM7SUFDRCxNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFDcEQsS0FBSyxFQUFFO1lBQ0wscUJBQXFCLEVBQUU7Z0JBQ3JCLE1BQU07Z0JBQ04sY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO2FBQ3JDO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUF0QlcsUUFBQSx1QkFBdUIsMkJBc0JsQyJ9