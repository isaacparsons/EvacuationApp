"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrgMemberFromOrgId = void 0;
const getOrgMemberFromOrgId = async (db, userId, organizationId) => {
    const member = await db.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId: userId,
                organizationId: organizationId
            }
        }
    });
    return member;
};
exports.getOrgMemberFromOrgId = getOrgMemberFromOrgId;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0T3JnTWVtYmVyRnJvbU9yZ0lkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Blcm1pc3Npb25zL3V0aWxzL2dldE9yZ01lbWJlckZyb21PcmdJZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFTyxNQUFNLHFCQUFxQixHQUFHLEtBQUssRUFDeEMsRUFBZ0IsRUFDaEIsTUFBYyxFQUNkLGNBQXNCLEVBQ3RCLEVBQUU7SUFDRixNQUFNLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7UUFDcEQsS0FBSyxFQUFFO1lBQ0wscUJBQXFCLEVBQUU7Z0JBQ3JCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLGNBQWMsRUFBRSxjQUFjO2FBQy9CO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFkVyxRQUFBLHFCQUFxQix5QkFjaEMifQ==