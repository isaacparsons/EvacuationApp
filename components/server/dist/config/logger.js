"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockLogger = void 0;
const bunyan_1 = __importDefault(require("bunyan"));
const path_1 = __importDefault(require("path"));
exports.mockLogger = {
    error: () => {
        return;
    },
    info: () => {
        return;
    }
};
const logger = (name, options) => {
    if (process.env.NODE_ENV === "test") {
        return exports.mockLogger;
    }
    const logPath = path_1.default.join(__dirname, "../../logs/logs.log");
    return bunyan_1.default.createLogger(Object.assign(Object.assign({ name }, options), { streams: [
            {
                level: "info",
                path: logPath
            },
            {
                level: "error",
                path: logPath
            },
            {
                level: "info",
                stream: process.stdout
            },
            {
                level: "error",
                stream: process.stdout
            }
        ] }));
};
exports.default = logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbmZpZy9sb2dnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGdEQUF3QjtBQUVYLFFBQUEsVUFBVSxHQUFHO0lBQ3hCLEtBQUssRUFBRSxHQUFHLEVBQUU7UUFDVixPQUFPO0lBQ1QsQ0FBQztJQUNELElBQUksRUFBRSxHQUFHLEVBQUU7UUFDVCxPQUFPO0lBQ1QsQ0FBQztDQUNGLENBQUM7QUFFRixNQUFNLE1BQU0sR0FBRyxDQUFDLElBQVksRUFBRSxPQUFhLEVBQUUsRUFBRTtJQUM3QyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sRUFBRTtRQUNuQyxPQUFPLGtCQUFVLENBQUM7S0FDbkI7SUFDRCxNQUFNLE9BQU8sR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO0lBQzVELE9BQU8sZ0JBQU0sQ0FBQyxZQUFZLCtCQUN4QixJQUFJLElBQ0QsT0FBTyxLQUNWLE9BQU8sRUFBRTtZQUNQO2dCQUNFLEtBQUssRUFBRSxNQUFNO2dCQUNiLElBQUksRUFBRSxPQUFPO2FBQ2Q7WUFDRDtnQkFDRSxLQUFLLEVBQUUsT0FBTztnQkFDZCxJQUFJLEVBQUUsT0FBTzthQUNkO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2FBQ3ZCO1lBQ0Q7Z0JBQ0UsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO2FBQ3ZCO1NBQ0YsSUFDRCxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsTUFBTSxDQUFDIn0=