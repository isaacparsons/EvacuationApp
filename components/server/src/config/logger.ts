import bunyan from "bunyan";
import path from "path";

export const mockLogger = {
  error: () => {
    return;
  },
  info: () => {
    return;
  }
};

const logger = (name: string, options?: any) => {
  if (process.env.NODE_ENV) {
    return mockLogger;
  }
  const logPath = path.join(__dirname, "../../logs/logs.log");
  return bunyan.createLogger({
    name,
    ...options,
    streams: [
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
    ]
  });
};

export default logger;
