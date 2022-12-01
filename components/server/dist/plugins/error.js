"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLErrorsHandler = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const log = (0, logger_1.default)("evacuationApp");
exports.GraphQLErrorsHandler = {
    async requestDidStart({ context }) {
        return {
            async didEncounterErrors({ errors }) {
                if (errors.length > 0) {
                    errors.forEach((error) => {
                        log.error(error);
                    });
                }
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcGx1Z2lucy9lcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFLQSw4REFBc0M7QUFFdEMsTUFBTSxHQUFHLEdBQUcsSUFBQSxnQkFBTSxFQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRXZCLFFBQUEsb0JBQW9CLEdBQW9DO0lBQ25FLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFDcEIsT0FBTyxFQUNSO1FBQ0MsT0FBTztZQUNMLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLE1BQU0sRUFBRTtnQkFDakMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDckIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO3dCQUN2QixHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNuQixDQUFDLENBQUMsQ0FBQztpQkFDSjtZQUNILENBQUM7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGLENBQUMifQ==