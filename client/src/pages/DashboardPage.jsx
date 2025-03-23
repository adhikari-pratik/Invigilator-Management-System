import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAdmin, selectUser } from "../features/auth/authSlice";
import {
	fetchSystemStats,
	fetchInvigilatorStats,
	selectStats,
} from "../features/stats/statsSlice";
import { fetchMonthlyExamStats } from "../features/exams/examSlice";
import {
	UserGroupIcon,
	CalendarIcon,
	ClipboardDocumentCheckIcon,
	CheckCircleIcon,
	XCircleIcon,
	ClockIcon,
} from "@heroicons/react/24/outline";
import StatCard from "../components/dashboard/StatCard";
import ExamsChart from "../components/dashboard/ExamsChart";
import RecentAssignments from "../components/dashboard/RecentAssignments";
import UpcomingExams from "../components/dashboard/UpcomingExams";

const DashboardPage = () => {
	const dispatch = useDispatch();
	const isAdmin = useSelector(selectIsAdmin);
	const user = useSelector(selectUser);
	const { systemStats, invigilatorStats, loading } = useSelector(selectStats);

	useEffect(() => {
		// Initial fetch
		if (isAdmin) {
			dispatch(fetchSystemStats());
			dispatch(fetchMonthlyExamStats());
		} else {
			dispatch(fetchInvigilatorStats());
		}

		// Set up polling interval (every 30 seconds)
		const intervalId = setInterval(() => {
			if (isAdmin) {
				dispatch(fetchSystemStats());
				dispatch(fetchMonthlyExamStats());
			} else {
				dispatch(fetchInvigilatorStats());
			}
		}, 30 * 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [dispatch, isAdmin]);

	const renderAdminDashboard = () => (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Admin Dashboard
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Overview of the system statistics and upcoming activities.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Invigilators"
					value={systemStats?.users?.invigilators || 0}
					icon={<UserGroupIcon className="h-6 w-6 text-primary-600" />}
					loading={loading}
				/>
				<StatCard
					title="Total Exams"
					value={systemStats?.exams?.total || 0}
					icon={<CalendarIcon className="h-6 w-6 text-primary-600" />}
					loading={loading}
				/>
				<StatCard
					title="Upcoming Exams"
					value={systemStats?.exams?.upcoming || 0}
					icon={<ClockIcon className="h-6 w-6 text-warning-500" />}
					loading={loading}
				/>
				<StatCard
					title="Pending Assignments"
					value={systemStats?.assignments?.pending || 0}
					icon={
						<ClipboardDocumentCheckIcon className="h-6 w-6 text-warning-500" />
					}
					loading={loading}
				/>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
				<div className="card">
					<div className="card-header">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Monthly Exams
						</h3>
					</div>
					<div className="card-body">
						<ExamsChart />
					</div>
				</div>

				<div className="card">
					<div className="card-header">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Upcoming Exams
						</h3>
					</div>
					<div className="card-body">
						<UpcomingExams limit={5} />
					</div>
				</div>
			</div>

			<div className="mt-5">
				<div className="card">
					<div className="card-header">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Recent Assignments
						</h3>
					</div>
					<div className="card-body">
						<RecentAssignments limit={5} />
					</div>
				</div>
			</div>
		</div>
	);

	const renderInvigilatorDashboard = () => (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
					Welcome, {user?.fullName}
				</h1>
				<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
					Here's an overview of your assignments and activities.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Assignments"
					value={invigilatorStats?.assignments?.total || 0}
					icon={
						<ClipboardDocumentCheckIcon className="h-6 w-6 text-primary-600" />
					}
					loading={loading}
				/>
				<StatCard
					title="Upcoming Assignments"
					value={invigilatorStats?.assignments?.upcoming || 0}
					icon={<CalendarIcon className="h-6 w-6 text-warning-500" />}
					loading={loading}
				/>
				<StatCard
					title="Completed Assignments"
					value={invigilatorStats?.assignments?.completed || 0}
					icon={<CheckCircleIcon className="h-6 w-6 text-success-600" />}
					loading={loading}
				/>
				<StatCard
					title="Pending Actions"
					value={invigilatorStats?.assignments?.pending || 0}
					icon={<ClockIcon className="h-6 w-6 text-danger-500" />}
					loading={loading}
				/>
			</div>

			<div className="mt-8">
				<div className="card">
					<div className="card-header">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							My Assignments
						</h3>
					</div>
					<div className="card-body">
						<RecentAssignments invigilatorMode limit={5} />
					</div>
				</div>
			</div>
		</div>
	);

	return isAdmin ? renderAdminDashboard() : renderInvigilatorDashboard();
};

export default DashboardPage;
