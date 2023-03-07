"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
server_1.server.listen().then(({ url }) => {
    console.log(process.env);
    console.log(`🚀  Server ready at ${url}`); // tslint:disable-line no-console
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBa0M7QUFFbEMsZUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUNBQWlDO0FBQzlFLENBQUMsQ0FBQyxDQUFDIn0=