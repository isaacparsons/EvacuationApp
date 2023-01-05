"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = __importDefault(require("../services/EmailService"));
const NotificationService_1 = require("../services/NotificationService");
const OrganizationService_1 = require("../services/OrganizationService");
const OrganizationService_2 = require("../services/OrganizationService");
const emailService = new EmailService_1.default();
const OrganizationResolver = {
    Query: {
        getOrganizations: async (parent, args, context, info) => {
            const organizations = await (0, OrganizationService_1.getOrganizationsForUser)({
                db: context.db,
                userId: context.user.id
            });
            return organizations;
        },
        getOrganization: async (parent, args, context, info) => {
            return (0, OrganizationService_1.getOrganization)({
                db: context.db,
                organizationId: args.organizationId
            });
        },
        getOrganizationForUser: async (parent, args, context, info) => {
            return (0, OrganizationService_2.getOrganizationForUser)({
                db: context.db,
                organizationId: args.organizationId,
                userId: context.user.id
            });
        }
    },
    Mutation: {
        createOrganization: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.createOrganization)(Object.assign(Object.assign({ db: context.db }, args), { userId: context.user.id }));
            return organization;
        },
        deleteOrganization: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.deleteOrganization)(Object.assign({ db: context.db }, args));
            return organization;
        },
        updateOrganizationNotificationOptions: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_2.updateOrganizationNotificationOptions)(Object.assign({ db: context.db }, args));
            return organization;
        },
        inviteToOrganization: async (parent, args, context, info) => {
            const members = await (0, OrganizationService_1.inviteToOrganization)(Object.assign({ db: context.db }, args));
            await (0, NotificationService_1.sendCompleteSignupNotifications)({ db: context.db, members });
            return members;
        },
        updateOrgInvite: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.updateOrgInvite)(Object.assign(Object.assign({ db: context.db }, args), { userId: context.user.id }));
            return organization;
        },
        removeFromOrganization: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.removeFromOrganization)(Object.assign({ db: context.db }, args));
            return organization;
        },
        createOrganizationAnnouncement: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.createOrganizationAnnouncement)(Object.assign({ db: context.db, userId: context.user.id }, args));
            return organization;
        },
        deleteOrganizationAnnouncement: async (parent, args, context, info) => {
            const organization = await (0, OrganizationService_1.deleteOrganizationAnnouncement)(Object.assign({ db: context.db, userId: context.user.id }, args));
            return organization;
        }
    }
};
exports.default = OrganizationResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw0RUFBb0Q7QUFDcEQseUVBQWtGO0FBQ2xGLHlFQVV5QztBQUN6Qyx5RUFHeUM7QUFHekMsTUFBTSxZQUFZLEdBQUcsSUFBSSxzQkFBWSxFQUFFLENBQUM7QUFFeEMsTUFBTSxvQkFBb0IsR0FBRztJQUMzQixLQUFLLEVBQUU7UUFDTCxnQkFBZ0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFLElBQUksRUFBRSxFQUFFO1lBQy9ELE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBQSw2Q0FBdUIsRUFBQztnQkFDbEQsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLE1BQU0sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7YUFDeEIsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxhQUFhLENBQUM7UUFDdkIsQ0FBQztRQUNELGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFLElBQUksRUFBRSxFQUFFO1lBQzlELE9BQU8sSUFBQSxxQ0FBZSxFQUFDO2dCQUNyQixFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ2QsY0FBYyxFQUFFLElBQUksQ0FBQyxjQUFjO2FBQ3BDLENBQUMsQ0FBQztRQUNMLENBQUM7UUFDRCxzQkFBc0IsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFnQixFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JFLE9BQU8sSUFBQSw0Q0FBc0IsRUFBQztnQkFDNUIsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUN4QixD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