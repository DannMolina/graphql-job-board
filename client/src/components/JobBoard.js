import { useJobs } from '../graphql/hooks';
import JobList from './JobList';

function JobBoard() {
	const { data, loading, error } = useJobs();

	if (error) {
		return <p>Sorry, something went wrong.</p>;
	}
	return (
		<div>
			<h1 className='title'>Job Board</h1>
			{!loading && <JobList jobs={data.jobs} />}
		</div>
	);
}

export default JobBoard;
