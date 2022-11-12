import { Company, Job } from './db.js';
import { companyResolver } from './resolvers/company.js';

function rejectIf(condition) {
	if (condition) {
		throw new Error('Unathorized');
	}
}
/**
 * resolver object like "Job" always need to match schema definition
 */
export const resolvers = {
	Query: {
		job: (root, args) => {
			return Job.findById(args.id);
		},
		jobs: () => Job.findAll(), // resolver function sample
		company: companyResolver,
	},

	Mutation: {
		// * arg = parent, input, context(any additional request needed that is not part of the standard graphql request)
		createJob: (_root, { input }, { user }) => {
			rejectIf(!user);

			// return Job.create(input);
			return Job.create({ ...input, companyId: user.companyId });
		},
		deleteJob: async (_root, { id }, { user }) => {
			// check user is authenticated and job belongs to their company
			rejectIf(!user);

			const job = await Job.findById(id);
			rejectIf(job.companyId !== user.companyId);
			return Job.delete(id);
		},
		updateJob: async (_root, { input }, { user }) => {
			rejectIf(!user);

			const job = await Job.findById(input.id);
			rejectIf(job.companyId !== user.companyId);

			return Job.update({ ...input, companyId: user.companyId });
		},
	},

	Company: {
		jobs: (company) => Job.findAll((job) => job.companyId === company.id),
	},
	Job: {
		/**
		 * @param {parent object} job
		 * @returns
		 */
		company: (job) => {
			return Company.findById(job.companyId);
		},
	},
};
