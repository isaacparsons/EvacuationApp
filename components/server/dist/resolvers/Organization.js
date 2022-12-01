"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrganizationService_1 = require("../services/OrganizationService");
const EmailService_1 = __importDefault(require("../services/EmailService"));
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
            return await (0, OrganizationService_1.getOrganization)({
                db: context.db,
                organizationId: args.organizationId
            });
        },
        getOrganizationForUser: async (parent, args, context, info) => {
            return await (0, OrganizationService_2.getOrganizationForUser)({
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
        inviteToOrganization: async (parent, args, context, info) => {
            const members = await (0, OrganizationService_1.inviteToOrganization)(Object.assign({ db: context.db }, args));
            const membersToEmail = members.filter((member) => !member.user.accountCreated);
            await Promise.all(membersToEmail.map(async (member) => {
                await emailService.sendCompleteSignup(member.user, member.organization);
            }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3JnYW5pemF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Jlc29sdmVycy9Pcmdhbml6YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5RUFVeUM7QUFDekMsNEVBQW9EO0FBQ3BELHlFQUF5RTtBQUd6RSxNQUFNLFlBQVksR0FBRyxJQUFJLHNCQUFZLEVBQUUsQ0FBQztBQUV4QyxNQUFNLG9CQUFvQixHQUFHO0lBQzNCLEtBQUssRUFBRTtRQUNMLGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDL0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDZDQUF1QixFQUFDO2dCQUNsRCxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUU7Z0JBQ2QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUN4QixDQUFDLENBQUM7WUFDSCxPQUFPLGFBQWEsQ0FBQztRQUN2QixDQUFDO1FBQ0QsZUFBZSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQWdCLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDOUQsT0FBTyxNQUFNLElBQUEscUNBQWUsRUFBQztnQkFDM0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYzthQUNwQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBQ0Qsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBZ0IsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNyRSxPQUFPLE1BQU0sSUFBQSw0Q0FBc0IsRUFBQztnQkFDbEMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO2dCQUNkLGNBQWMsRUFBRSxJQUFJLENBQUMsY0FBYztnQkFDbkMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTthQUN4QixDQUFD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