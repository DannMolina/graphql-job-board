import { Company } from '../db.js';

export const companyResolver = (root, args) => {
	return Company.findById(args.id);
};
