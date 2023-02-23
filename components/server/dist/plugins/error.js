"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLErrorsHandler = void 0;
exports.GraphQLErrorsHandler = {
    async requestDidStart({ context }) {
        return {
            async didEncounterErrors({ errors }) {
                if (errors.length > 0) {
                    errors.forEach((error) => {
                        context.log.error(error);
                    });
                }
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGx1Z2lucy9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLG9CQUFvQixHQUFvQztJQUNuRSxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsT0FBTyxFQUFFO1FBQy9CLE9BQU87WUFDTCxLQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBRSxNQUFNLEVBQUU7Z0JBQ2pDLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7b0JBQ3JCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTt3QkFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNCLENBQUMsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQztTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyJ9