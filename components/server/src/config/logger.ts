import bunyan from "bunyan";
const logger = (name: string) =>
  bunyan.createLogger({
    name
    // streams: [
    //   {
    //     level: 'error',
    //     path: 'src/logs/tmp/myapp-error.log'
    //   }
    // ]
  });

export default logger;
