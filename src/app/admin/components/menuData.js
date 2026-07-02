// "use client"

import { label, line } from "framer-motion/client";
import {
	Users,
	UserCheck,
	BookOpen,
	ClipboardCheck,
	FileSpreadsheet,
	CreditCard,
	Users2,
	Bookmark,
	Bus,
	MessageSquare,
	HeartPulse,
	PartyPopper,
	Box,
	BarChart3,
	Settings,
	ShieldAlert,
	LayoutDashboard,
} from "lucide-react";

export const menuConfig = [
	{
		name: "Dashboard",
		icon: LayoutDashboard,
		isDropdown: false,
		link: "/admin/dashboard",
	},
	{
		name: "Students",
		icon: Users,
		isDropdown: true,
		subItems: [
			{
				label: "Student List",
				link: "/admin/pages/students/studentsList",
			},
			{ label: "New Admission", link: "/admin/pages/students/admission" },
			{
				label: "Student Attendance",
				link: "/admin/pages/students/attendance",
			},
			{
				label: "Student Promotion",
				link: "/admin/pages/students/promotion",
			},
			{
				label: "Transfer Certificate (TC)",
				link: "/admin/pages/students/tc",
			},
			{ label: "Student ID Cards", link: "/admin/pages/students/IdCard" },
			{ label: "Alumni Students", link: "/admin/pages/students/alumni" },
			{
				label: "Documents Management",
				link: "/admin/pages/students/documents",
			},
		],
	},
	{
		name: "Teachers",
		icon: UserCheck,
		isDropdown: true,
		subItems: [
			{ label: "Teacher List", link: "/admin/pages/teachers/list" },
			{ label: "Add Teacher", link: "/admin/pages/teachers/add" },
			{ label: "Attendance", link: "/admin/pages/teachers/attendance" },
			{ label: "Leave Requests", link: "/admin/pages/teachers/leaves" },
			{ label: "Payroll", link: "/admin/pages/teachers/payroll" },
			{
				label: "Performance Evaluation",
				link: "/admin/pages/teachers/performance",
			},
			{
				label: "Teacher Documents",
				link: "/admin/pages/teachers/documents",
			},
		],
	},
	{
		name: "Supporting Staff",
		icon: UserCheck,
		isDropdown: true,
		subItems: [
			{ label: "Staff List", link: "/admin/pages/otherStaff/list" },
			{ label: "Add Member", link: "/admin/pages/otherStaff/add" },

			{ label: "Leave Requests", link: "/admin/pages/otherStaff/leave" },
			{ label: "Payroll", link: "/admin/pages/otherStaff/payroll" },

			{
				label: "Staff Documents",
				link: "/admin/pages/otherStaff/documents",
			},
		],
	},
	{
		name: "Academics",
		icon: BookOpen,
		isDropdown: true,
		subItems: [
			{ label: "Classes", link: "/admin/pages/academics/classes" },
			{ label: "Subjects", link: "/admin/pages/academics/subjects" },
			{ label: "Timetable", link: "/admin/pages/academics/timetable" },
			{
				label: "Assignments",
				link: "/admin/pages/academics/assignments",
			},

			{
				label: "Academic Calendar",
				link: "/admin/pages/academics/calendar",
			},
			{
				label: "Syllabus Management",
				link: "/admin/pages/academics/syllabus",
			},
		],
	},

	{
		name: "Report Cards",
		icon: BookOpen,
		isDropdown: true,
		subItems: [
			{
				label: "Generate Marksheet",
				link: "/admin/pages/marksheet/singleMarksheet",
			},
			{
				label: "Bulk Generate",
				link: "/admin/pages/marksheet/bulkGenerate",
			},

			{
				label: "Templates",
				link: "/admin/pages/marksheet/templates",
			},
		],
	},
	{
		name: "Attendance",
		icon: ClipboardCheck,
		isDropdown: true,
		subItems: [
			{
				label: "Attendance",
				link: "/admin/pages/attendance/daily",
				title: "daily",
			},
			{
				label: "Attendance Reports",
				link: "/admin/pages/attendance/reports",
			},
		],
	},
	{
		name: "Examination",
		icon: FileSpreadsheet,
		isDropdown: true,
		subItems: [
			{ label: "Exam Types", link: "/admin/pages/exams/types" },
			{ label: "Exam Schedule", link: "/admin/pages/exams/schedule" },
			{ label: "Update Marks", link: "/admin/pages/exams/UpdateMarks" },
			{ label: "Grade System", link: "/admin/pages/exams/grade" },
			{ label: "Result Analysis", link: "/admin/pages/exams/analysis" },
			{ label: "Hall Tickets", link: "/admin/pages/exams/hall-tickets" },
		],
	},
	{
		name: "Fees & Finance",
		icon: CreditCard,
		isDropdown: true,
		subItems: [
			{ label: "Fee Structure", link: "/admin/pages/finance/feeStructure" },
			{ label: "Fee Collection", link: "/admin/pages/finance/feeCollection" },
			{ label: "Scholarships", link: "/admin/pages/finance/scholarship" },
			{ label: "Expenses", link: "/admin/pages/finance/expenses" },
			{
				label: "Financial Reports",
				link: "/admin/pages/finance/reports",
			},
		],
	},
	{
		name: "Parents",
		icon: Users2,
		isDropdown: true,
		subItems: [
			{ label: "Parent List", link: "/admin/pages/parents/list" },
			{ label: "Parent Accounts", link: "/admin/pages/parents/accounts" },
			{ label: "Parent Feedback", link: "/admin/pages/parents/feedback" },
			{ label: "Parent Meetings", link: "/admin/pages/parents/meetings" },
		],
	},
	{
		name: "Library",
		icon: Bookmark,
		isDropdown: true,
		subItems: [
			{ label: "Books", link: "/dashboard/library/books" },
			{ label: "Categories", link: "/dashboard/library/categories" },
			{ label: "Issue Books", link: "/dashboard/library/issue" },
			{ label: "Return Books", link: "/dashboard/library/return" },
			{ label: "Fine Collection", link: "/dashboard/library/fine" },
		],
	},
	{
		name: "Transport",
		icon: Bus,
		isDropdown: true,
		subItems: [
			{ label: "Vehicles", link: "/admin/pages/transport/vehicles" },
			{ label: "Routes", link: "/admin/pages/transport/routes" },
			{ label: "Drivers", link: "/admin/pages/transport/drivers" },
			{
				label: "Student Allocation",
				link: "/dashboard/transport/allocation",
			},
			{
				label: "Fuel & Maintenance",
				link: "/dashboard/transport/maintenance",
			},
		],
	},
	{
		name: "Communication",
		icon: MessageSquare,
		isDropdown: true,
		subItems: [
			{
				label: "Announcements",
				link: "/dashboard/communication/announcements",
			},
			{ label: "SMS", link: "/dashboard/communication/sms" },
			{ label: "Email", link: "/dashboard/communication/email" },
			{ label: "Circulars", link: "/dashboard/communication/circulars" },
			{ label: "Events", link: "/dashboard/communication/events" },
		],
	},
	{
		name: "Health",
		icon: HeartPulse,
		isDropdown: true,
		subItems: [
			{ label: "Medical Records", link: "/dashboard/health/records" },
			{ label: "Health Checkups", link: "/dashboard/health/checkups" },
			{
				label: "Vaccination Records",
				link: "/dashboard/health/vaccinations",
			},
			{
				label: "Emergency Contacts",
				link: "/dashboard/health/emergency",
			},
		],
	},
	{
		name: "Events & Activities",
		icon: PartyPopper,
		isDropdown: true,
		subItems: [
			{ label: "School Events", link: "/dashboard/events/list" },
			{ label: "Competitions", link: "/dashboard/events/competitions" },
			{ label: "Sports Activities", link: "/dashboard/events/sports" },
			{ label: "Cultural Programs", link: "/dashboard/events/cultural" },
		],
	},
	{
		name: "Inventory",
		icon: Box,
		isDropdown: true,
		subItems: [
			{
				label: "Classroom Assets",
				link: "/dashboard/inventory/classroom",
			},
			{ label: "Lab Equipment", link: "/dashboard/inventory/lab" },
			{ label: "Stationery", link: "/dashboard/inventory/stationery" },
			{ label: "Stock Management", link: "/dashboard/inventory/stock" },
		],
	},
	{
		name: "Reports",
		icon: BarChart3,
		isDropdown: true,
		subItems: [
			{
				label: "Admission Reports",
				link: "/dashboard/reports/admission",
			},
			{
				label: "Attendance Reports",
				link: "/dashboard/reports/attendance",
			},
			{ label: "Fee Reports", link: "/dashboard/reports/fees" },
			{ label: "Exam Reports", link: "/dashboard/reports/exams" },
			{ label: "Library Reports", link: "/dashboard/reports/library" },
			{
				label: "Transport Reports",
				link: "/dashboard/reports/transport",
			},
		],
	},
	{
		name: "User Management",
		icon: ShieldAlert,
		isDropdown: true,
		subItems: [
			{ label: "Admins", link: "/admin/pages/users/admins" },
			{ label: "Teachers", link: "/admin/pages/users/teachers" },
			{ label: "Students", link: "/admin/pages/users/students" },
			{ label: "Parents", link: "/admin/pages/users/parents" },
			{
				label: "Roles & Permissions",
				link: "/admin/pages/users/permissions",
			},
		],
	},
	{
		name: "Settings",
		icon: Settings,
		isDropdown: true,
		subItems: [
			{
				label: "School Profile",
				link: "/admin/pages/settings/schoolProfile",
			},
			{
				label: "Admin Profile",
				link: "/admin/pages/settings/adminProfile",
			},

			{
				label: "Academic Sessions",
				link: "/dashboard/settings/sessions",
			},
			{ label: "User Roles", link: "/dashboard/settings/roles" },
			{ label: "Permissions", link: "/dashboard/settings/permissions" },
			{
				label: "Notification Settings",
				link: "/dashboard/settings/notifications",
			},
			{ label: "Backup & Restore", link: "/dashboard/settings/backup" },
		],
	},
];
