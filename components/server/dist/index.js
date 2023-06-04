"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const server_1 = require("./server");
server_1.server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`); // tslint:disable-line no-console
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBMEI7QUFDMUIscUNBQWtDO0FBRWxDLGVBQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUU7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztBQUM5RSxDQUFDLENBQUMsQ0FBQyJ9