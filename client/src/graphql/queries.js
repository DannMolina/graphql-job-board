/**
 * Note:
 * query is just a read-only operation
 * mutation is an operation to modify data(create and update)
 */
import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL = 'http://localhost:8000/graphql';

export const client = new ApolloClient({
	uri: GRAPHQL_URL,
	cache: new InMemoryCache(),

	/**
	 * optional
	 */
	// defaultOptions: {
	// 	query: {
	// 		fetchPolicy: 'network-only',
	// 	},
	// 	mutate: {
	// 		fetchPolicy: 'network-only',
	// 	},
	// 	/**
	// 	 * this is used when you want to not just fetch some data once
	// 	 * but you want to observe any changes to the result
	// 	 */
	// 	watchQuery: {
	// 		fetchPolicy: 'network-only',
	// 	},
	// },
});

/**
 * fragment is part of the object that we can reuse in a query or mutation
 */
export const JOB_DETAIL_FRAGMENT = gql`
	fragment JobDetail on Job {
		id
		title
		company {
			id
			name
		}
		description
	}
`;
export const JOB_QUERY = gql`
	# query JobQuery($id: ID!) {
	# 	job(id: $id) {
	# 		id
	# 		title
	# 		company {
	# 			id
	# 			name
	# 		}
	# 		description
	# 	}
	# }
	query JobQuery($id: ID!) {
		job(id: $id) {
			...JobDetail
		}
	}
	${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql`
	query JobsQuery {
		jobs {
			id
			title
			company {
				name
			}
		}
	}
`;

export const COMPANY_QUERY = gql`
	query CompanyQuery($id: ID!) {
		company(id: $id) {
			id
			name
			description
			jobs {
				id
				title
			}
		}
	}
`;

export const CREATE_JOB_MUTATION = gql`
	mutation CreateJobMutation($input: CreateJobInput) {
		job: createJob(input: $input) {
			...JobDetail
		}
	}
	${JOB_DETAIL_FRAGMENT}
`;
