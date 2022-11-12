import {
	COMPANY_QUERY,
	CREATE_JOB_MUTATION,
	JOBS_QUERY,
	JOB_QUERY,
} from './queries';
import { useQuery, useMutation } from '@apollo/client';
import { getAccessToken } from '../auth';

// * custom hook
export const useJobs = () => {
	const { data, loading, error } = useQuery(JOBS_QUERY, {
		fetchPolicy: 'network-only',
	});

	return { data, loading, error: Boolean(error) };
};

export const useJob = (id) => {
	const { data, loading, error } = useQuery(JOB_QUERY, {
		variables: { id },
	});

	return { job: data?.job, loading, error: Boolean(error) };
};

export const useCompany = (id) => {
	const { data, loading, error } = useQuery(COMPANY_QUERY, {
		variables: { id },
	});

	return { company: data?.company, loading, error: Boolean(error) };
};

export const useCreateJob = () => {
	const [mutate, { data, loading }] = useMutation(CREATE_JOB_MUTATION);

	return {
		createJob: async (title, description) => {
			const {
				data: { job },
			} = await mutate({
				variables: { input: { title, description } },
				context: {
					headers: { Authorization: 'Bearer ' + getAccessToken() },
				},
				// * this function is called after the mutation and can be used precisely to update the data in the cache
				update: (cache, { data: { job } }) => {
					cache.writeQuery({
						query: JOB_QUERY,
						variables: { id: job.id },
						data: { job },
					});
				},
			});

			return job;
		},
		loading,
	};
};
