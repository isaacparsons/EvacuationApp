"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mailhog_1 = __importDefault(require("../dev/Mailhog"));
const dbUtil_1 = require("../dev/dbUtil");
// shouldnt be able to sign up if account exists and account created == true
// shouldnt be able to sign up if account with email/phone number already exists
// should be able to sign up if account exists and account created == false
// should be able to sign up if account doesnt exist and account created == false
// should be able to login if account exists and account created == true
// shouldnt be able to login if account exists and account created == false
// shouldnt be able to reset password if account exists and account created == false
// should be able to reset password if account exists and account created == true
const mailhog = new Mailhog_1.default();
describe("user tests", () => {
    beforeEach(async () => {
        await (0, dbUtil_1.deleteDb)();
        await mailhog.deleteAllEmails();
    });
    it("test", () => { });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Rlc3RzL1VzZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZEQUFxQztBQUNyQywwQ0FBeUM7QUFDekMsNEVBQTRFO0FBQzVFLGdGQUFnRjtBQUNoRiwyRUFBMkU7QUFDM0UsaUZBQWlGO0FBRWpGLHdFQUF3RTtBQUN4RSwyRUFBMkU7QUFFM0Usb0ZBQW9GO0FBQ3BGLGlGQUFpRjtBQUNqRixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztBQUM5QixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDcEIsTUFBTSxJQUFBLGlCQUFRLEdBQUUsQ0FBQztRQUNqQixNQUFNLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNILEVBQUUsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkIsQ0FBQyxDQUFDLENBQUMifQ==