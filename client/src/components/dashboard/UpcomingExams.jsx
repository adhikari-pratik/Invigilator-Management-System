import React, { useEffect, memo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
	fetchUpcomingExams,
	selectUpcomingExams,
} from "../../features/exams/examSlice";

const UpcomingExams = memo(({ limit = 5 }) => {
	const dispatch = useDispatch();
	const { upcomingExams, loading } = useSelector(selectUpcomingExams);

	useEffect(() => {
		dispatch(fetchUpcomingExams({ page: 1, limit }));
	}, [dispatch, limit]);

	if (loading) {
		return (
			<div className="flex justify-center py-4">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
			</div>
		);
	}

	if (!upcomingExams || upcomingExams.length === 0) {
		return (
			<div className="text-center py-6 text-gray-500 dark:text-gray-400">
				No upcoming exams found.
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{upcomingExams.map((exam) => (
				<div
					key={exam.id}
					className="p-4 border rounded-md hover:bg-gray-50 dark:border-secondary-700 dark:hover:bg-secondary-700"
				>
					<div className="flex justify-between">
						<h4 className="font-medium text-gray-900 dark:text-white">
							{exam.title}
						</h4>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{format(new Date(exam.date), "MMM d, yyyy")}
						</span>
					</div>
					<div className="mt-1 flex justify-between text-sm">
						<span className="text-gray-600 dark:text-gray-300">
							Time: {exam.startTime} - {exam.endTime}
						</span>
						<span className="text-gray-600 dark:text-gray-300">
							{exam.classrooms.length} classroom
							{exam.classrooms.length !== 1 ? "s" : ""}
						</span>
					</div>
				</div>
			))}
			<div className="mt-2 flex justify-end">
				<Link
					to="/exams"
					className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
				>
					View all exams
				</Link>
			</div>
		</div>
	);
});

UpcomingExams.displayName = "UpcomingExams";

export default UpcomingExams;
